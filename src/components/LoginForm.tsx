
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, MapPin, Eye, EyeOff, Mail } from 'lucide-react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '@/utils/firebase';
import { Button } from '@/components/ui/button';

// Lista de estados brasileiros
const estadosBrasileiros = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    estado?: string;
    general?: string;
  }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      estado?: string;
    } = {};

    // Email validation
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    }

    // Estado validation
    if (!estado) {
      newErrors.estado = 'Selecione seu estado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar usuários normais
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        // Store logged in user with estado
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          // Use o estado fornecido no login
          estado: estado,
          location: user.location || '',
          phone: user.phone || '',
          cpf: user.cpf || '',
          city: user.city || '',
          profession: user.profession || '',
          birthday: user.birthday || '',
          isAdmin: false, // Garantir que usuários normais não tenham acesso de admin
        }));

        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo(a) de volta, ${user.name}!`,
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setErrors({
          general: 'E-mail ou senha incorretos',
        });
      }
    } catch (error) {
      setErrors({
        general: 'Ocorreu um erro ao fazer login. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!estado) {
      setErrors({
        estado: 'Selecione seu estado antes de continuar com o Google',
      });
      return;
    }

    setIsGoogleSubmitting(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in our system
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let existingUser = users.find((u: any) => u.email === user.email);
      
      if (existingUser) {
        // Update existing user with Google info
        existingUser.lastLogin = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        // Create new user from Google data
        const newUser = {
          id: Date.now().toString(),
          name: user.displayName || 'Usuário Google',
          email: user.email || '',
          estado: estado,
          phone: user.phoneNumber || '',
          cpf: '',
          city: '',
          profession: '',
          birthday: '',
          createdAt: new Date().toISOString(),
          isAdmin: false,
          googleId: user.uid
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        existingUser = newUser;
      }
      
      // Store user in localStorage as logged in
      localStorage.setItem('user', JSON.stringify({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        estado: estado,
        phone: existingUser.phone || '',
        cpf: existingUser.cpf || '',
        city: existingUser.city || '',
        profession: existingUser.profession || '',
        birthday: existingUser.birthday || '',
        isAdmin: false
      }));
      
      toast({
        title: 'Login com Google realizado com sucesso!',
        description: `Bem-vindo(a), ${existingUser.name}!`,
      });
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      setErrors({
        general: 'Ocorreu um erro ao fazer login com Google. Tente novamente.'
      });
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Entrar</h2>
      
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          <div className="text-right mt-1">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="estado" className="flex items-center text-sm font-medium text-text-dark mb-1">
            <MapPin size={16} className="mr-1" />
            Seu Estado
          </label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.estado ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione seu estado</option>
            {estadosBrasileiros.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
          {errors.estado && (
            <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 size={18} className="animate-spin mr-2" />
              Entrando...
            </span>
          ) : (
            'Entrar'
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {isGoogleSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                  s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20
                  s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
                  l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                  c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                  c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Entrar com Google
            </>
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-text">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/admin-login"
            className="flex items-center justify-center text-sm text-gray-600 hover:text-primary"
          >
            <ShieldAlert size={16} className="mr-1" />
            Acesso administrativo
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
