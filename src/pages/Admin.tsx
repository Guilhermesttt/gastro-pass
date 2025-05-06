
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { BarChart2, Users, Utensils, ArrowUp, ArrowDown } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    // In a real app, we would check if user is admin
    // For demo purposes, we'll just assume the user is an admin
    setIsAdmin(true);
  }, [navigate]);

  // Statistics data
  const stats = [
    {
      title: 'Usuários Ativos',
      value: '2,845',
      change: '+12.5%',
      isPositive: true,
      icon: <Users className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'Restaurantes',
      value: '48',
      change: '+4.2%',
      isPositive: true,
      icon: <Utensils className="w-6 h-6 text-green-500" />,
    },
    {
      title: 'Benefícios Resgatados',
      value: '8,623',
      change: '+18.7%',
      isPositive: true,
      icon: <BarChart2 className="w-6 h-6 text-purple-500" />,
    },
    {
      title: 'Taxa de Conversão',
      value: '2.4%',
      change: '-0.3%',
      isPositive: false,
      icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
    },
  ];

  // Recent users
  const recentUsers = [
    { id: 'U001', name: 'João Silva', email: 'joao@email.com', date: '2023-06-15', status: 'ativo' },
    { id: 'U002', name: 'Maria Oliveira', email: 'maria@email.com', date: '2023-06-14', status: 'ativo' },
    { id: 'U003', name: 'Pedro Santos', email: 'pedro@email.com', date: '2023-06-13', status: 'inativo' },
    { id: 'U004', name: 'Ana Souza', email: 'ana@email.com', date: '2023-06-12', status: 'ativo' },
    { id: 'U005', name: 'Carlos Lima', email: 'carlos@email.com', date: '2023-06-11', status: 'ativo' },
  ];

  // Recent restaurants
  const recentRestaurants = [
    { id: 'R001', name: 'La Tratoria', category: 'Italiana', location: 'Centro', date: '2023-06-10' },
    { id: 'R002', name: 'Sushi Kenzo', category: 'Japonesa', location: 'Jardins', date: '2023-06-09' },
    { id: 'R003', name: 'Burger House', category: 'Hamburgeria', location: 'Pinheiros', date: '2023-06-08' },
    { id: 'R004', name: 'Sabor Brasileiro', category: 'Brasileira', location: 'Vila Mariana', date: '2023-06-07' },
    { id: 'R005', name: 'Taco Libre', category: 'Mexicana', location: 'Itaim', date: '2023-06-06' },
  ];

  if (!isAdmin) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-text">Bem-vindo ao painel administrativo do RestoBenefícios.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-text mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Usuários Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-text">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {user.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t">
              <a href="/admin/users" className="text-sm text-primary hover:underline">
                Ver todos os usuários
              </a>
            </div>
          </div>
          
          {/* Recent Restaurants */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-lg">Restaurantes Recentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Localização
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentRestaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-dark">{restaurant.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {restaurant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {restaurant.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {restaurant.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t">
              <a href="/admin/restaurants" className="text-sm text-primary hover:underline">
                Ver todos os restaurantes
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
