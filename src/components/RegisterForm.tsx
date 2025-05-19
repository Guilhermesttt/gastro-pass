
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, Calendar, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

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

// Formatar o CPF
const formatCPF = (cpf: string) => {
  return cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

// Formatar o telefone
const formatPhone = (phone: string) => {
  return phone
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
};

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [estado, setEstado] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    estado?: string;
    phone?: string;
    cpf?: string;
    city?: string;
    profession?: string;
    birthday?: string;
    general?: string;
  }>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  // Carrega as localidades disponíveis dos restaurantes cadastrados
  useEffect(() => {
    const storedRestaurants = localStorage.getItem('restaurants');
    if (storedRestaurants) {
      try {
        const restaurants = JSON.parse(storedRestaurants);
        // Extrai localidades únicas dos restaurantes
        const uniqueLocations = Array.from(new Set(restaurants.map((r: any) => r.location)))
          .filter(Boolean)
          .map(location => ({
            value: location as string,
            label: location as string
          }));
        
        // This useEffect is no longer needed for states, but keeping it for now if 'location' is used elsewhere.
        // If 'location' is not used elsewhere, this useEffect can be removed.
        // setAvailableLocations(uniqueLocations);
      } catch (error) {
        console.error('Erro ao carregar localidades:', error);
        // setAvailableLocations([]);
      }
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      estado?: string;
      phone?: string;
      cpf?: string;
      general?: string;
    } = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
    } else {
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.some((user: any) => user.email === email);
      if (emailExists) {
        newErrors.email = 'Este e-mail já está em uso';
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    // Location validation
    if (!estado) {
      newErrors.estado = 'Selecione seu estado';
    }

    // Phone validation (REQUIRED)
    if (!phone) {
      newErrors.phone = 'O telefone é obrigatório';
    } else if (phone.replace(/\D/g, '').length < 11) {
      newErrors.phone = 'Telefone inválido';
    }

    // CPF validation (optional but validate if provided)
    if (cpf && cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF inválido';
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
      
      // Create a new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        estado,
        phone,
        cpf: cpf || '',
        city: city || '',
        profession: profession || '',
        birthday: birthday || '',
        createdAt: new Date().toISOString(),
        isAdmin: false,
      };
      
      // Add to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Store logged in user
      localStorage.setItem('user', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        estado: newUser.estado,
        phone: newUser.phone,
        cpf: newUser.cpf,
        city: newUser.city,
        profession: newUser.profession,
        birthday: newUser.birthday,
        createdAt: newUser.createdAt,
        isAdmin: false,
      }));
      
      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Bem-vindo ao Gastro Pass!',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        general: 'Ocorreu um erro ao realizar o cadastro. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
      
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Nome completo */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">
            Nome completo
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite seu nome completo"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Telefone (REQUIRED) */}
        <div className="mb-4">
          <label htmlFor="phone" className="flex items-center text-sm font-medium text-text-dark mb-1">
            <Phone size={16} className="mr-1" /> Telefone <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(00) 00000-0000"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* CPF (optional) */}
        <div className="mb-4">
          <label htmlFor="cpf" className="block text-sm font-medium text-text-dark mb-1">
            CPF (opcional)
          </label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={handleCPFChange}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.cpf ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="000.000.000-00"
          />
          {errors.cpf && (
            <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
          )}
        </div>

        {/* Estado */}
        <div className="mb-4">
          <label htmlFor="estado" className="flex items-center text-sm font-medium text-text-dark mb-1">
            <MapPin size={16} className="mr-1" /> Estado
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

        {/* Cidade (optional) */}
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-text-dark mb-1">
            Cidade (opcional)
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Sua cidade"
          />
        </div>

        {/* Profissão (optional) */}
        <div className="mb-4">
          <label htmlFor="profession" className="flex items-center text-sm font-medium text-text-dark mb-1">
            <User size={16} className="mr-1" /> Profissão (opcional)
          </label>
          <input
            type="text"
            id="profession"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Sua profissão"
          />
        </div>

        {/* Aniversário (optional) */}
        <div className="mb-4">
          <label htmlFor="birthday" className="flex items-center text-sm font-medium text-text-dark mb-1">
            <Calendar size={16} className="mr-1" /> Data de nascimento (opcional)
          </label>
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Senha */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Mínimo de 6 caracteres"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirmar senha */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-dark mb-1">
            Confirmar senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Digite sua senha novamente"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" /> Cadastrando...
            </>
          ) : (
            'Criar conta'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
