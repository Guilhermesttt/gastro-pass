import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { BarChart2, Users, Utensils, ArrowUp, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  status?: string; // Add this line
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentRestaurants, setRecentRestaurants] = useState<Restaurant[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (!user.isAdmin) {
        navigate('/dashboard');
        return;
      }
      
      setIsAdmin(true);
      
      // Carregar usuários do localStorage
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        setTotalUsers(users.length);
        // Pegar os 5 usuários mais recentes
        const sortedUsers = [...users].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }).slice(0, 5);
        
        setRecentUsers(sortedUsers.map((user: any) => ({
          id: user.id || `U${Math.floor(Math.random() * 1000)}`,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt || new Date().toISOString(),
          status: "ativo" // Poderia ser dinâmico se tivéssemos essa informação
        })));
      } else {
        setRecentUsers([]);
      }
      
      // Carregar restaurantes do localStorage
      const storedRestaurants = localStorage.getItem('restaurants');
      if (storedRestaurants) {
        const restaurants = JSON.parse(storedRestaurants);
        setTotalRestaurants(restaurants.length);
        // Pegar os 5 restaurantes (poderia ser ordenado por data de cadastro se tivéssemos essa informação)
        setRecentRestaurants(restaurants.slice(0, 5).map((restaurant: any) => ({
          id: restaurant.id || `R${Math.floor(Math.random() * 1000)}`,
          name: restaurant.name,
          category: restaurant.category,
          location: restaurant.location
        })));
      } else {
        setRecentRestaurants([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Statistics data
  const stats = [
    {
      title: 'Usuários Cadastrados',
      value: totalUsers.toString(),
      change: '+12.5%',
      isPositive: true,
      icon: <Users className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'Restaurantes',
      value: totalRestaurants.toString(),
      change: '+4.2%',
      isPositive: true,
      icon: <Utensils className="w-6 h-6 text-green-500" />,
    },
    {
      title: 'Benefícios Resgatados',
      value: '0',
      change: '0%',
      isPositive: true,
      icon: <BarChart2 className="w-6 h-6 text-purple-500" />,
    },
    {
      title: 'Taxa de Conversão',
      value: '0%',
      change: '0%',
      isPositive: false,
      icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
    },
  ];

  // Formatar data ISO para exibição
  const formatDate = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  if (!isAdmin) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 lg:p-8 w-full lg:ml-64">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-text">Bem-vindo ao painel administrativo do Gastro Pass.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-text mb-1">{stat.title}</p>
                  <h3 className="text-xl lg:text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className="rounded-full bg-gray-100 p-2 lg:p-3">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-3 lg:mt-4 flex items-center">
                {stat.isPositive ? (
                  <ArrowUp size={16} className="text-green-500 mr-1" />
                ) : (
                  <ArrowDown size={16} className="text-red-500 mr-1" />
                )}
                <span className={`text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-text ml-1">desde o último mês</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tables */}
        <div className="space-y-6 lg:space-y-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 lg:px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Usuários Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text-dark">{user.id}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                          {user.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum usuário cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 lg:px-6 py-3 border-t">
              <Link to="/admin/users" className="text-sm text-primary hover:underline">
                Ver todos os usuários
              </Link>
            </div>
          </div>

          {/* Recent Restaurants */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 lg:px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Restaurantes Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Localização
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentRestaurants.length > 0 ? (
                    recentRestaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text-dark">{restaurant.id}</td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {restaurant.name}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                          {restaurant.category}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                          {restaurant.location}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum restaurante cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 lg:px-6 py-3 border-t">
              <Link to="/admin/restaurants" className="text-sm text-primary hover:underline">
                Ver todos os restaurantes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
