import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Credenciais de administrador
const ADMIN_EMAIL = 'admin@gastropass.com';
const ADMIN_PASSWORD = 'admin@998';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
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

      // Verificar credenciais de administrador
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Login de administrador
        localStorage.setItem('user', JSON.stringify({
          id: 'admin1',
          name: 'Administrador',
          email: ADMIN_EMAIL,
          isAdmin: true, // Marcar como administrador
        }));

        toast({
          title: 'Login de administrador realizado com sucesso!',
          description: 'Bem-vindo(a) de volta, Administrador!',
        });

        // Redirecionar para o painel de administração
        navigate('/admin');
      } else {
        setErrors({
          general: 'Credenciais de administrador inválidas',
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className={`flex-grow flex items-center justify-center ${isMobile ? 'pt-36' : 'pt-28'} pb-20 bg-gray-50`}>
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden my-4 sm:my-8">
            <div className="p-6 w-full">
              <div className="flex items-center justify-center mb-4 text-yellow-600">
                <ShieldAlert size={36} />
              </div>
              
              <h2 className="text-2xl font-bold mb-6 text-center">Acesso de Administrador</h2>
              
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">
                    E-mail de Administrador
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="admin@gastropass.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">
                    Senha de Administrador
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" /> Entrando...
                    </>
                  ) : (
                    'Entrar como Administrador'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-text">
                  <Link to="/" className="text-primary hover:underline font-medium">
                    Voltar para a página inicial
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
