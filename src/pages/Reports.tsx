import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { Users, Utensils, Calendar, ArrowUpRight, CalendarDays } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  location?: string;
  createdAt: string;
}

interface RestaurantData {
  id: string;
  name: string;
  category: string;
  location: string;
}

interface ReportData {
  totalUsers: number;
  totalRestaurants: number;
  users: UserData[];
  restaurants: RestaurantData[];
  topLocations: {location: string, count: number}[];
  topCategories: {category: string, count: number}[];
}

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (!user.isAdmin) {
        navigate('/dashboard');
        return;
      }

      // Carregar dados para relatórios
      loadReportData();
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      navigate('/login');
    }
  }, [navigate]);

  const loadReportData = () => {
    setLoading(true);
    
    try {
      // Carregar usuários
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      // Carregar restaurantes
      const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      
      // Processar dados
      const reportData: ReportData = {
        totalUsers: users.length,
        totalRestaurants: restaurants.length,
        users: users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          location: user.location,
          createdAt: user.createdAt || new Date().toISOString()
        })),
        restaurants: restaurants.map((restaurant: any) => ({
          id: restaurant.id,
          name: restaurant.name,
          category: restaurant.category,
          location: restaurant.location
        })),
        topLocations: getTopLocations(restaurants),
        topCategories: getTopCategories(restaurants)
      };
      
      setReportData(reportData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do relatório.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para obter os locais mais populares
  const getTopLocations = (restaurants: any[]) => {
    const locationCounts: Record<string, number> = {};
    
    restaurants.forEach((restaurant: any) => {
      if (restaurant.location) {
        locationCounts[restaurant.location] = (locationCounts[restaurant.location] || 0) + 1;
      }
    });
    
    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };
  
  // Função para obter as categorias mais populares
  const getTopCategories = (restaurants: any[]) => {
    const categoryCounts: Record<string, number> = {};
    
    restaurants.forEach((restaurant: any) => {
      if (restaurant.category) {
        categoryCounts[restaurant.category] = (categoryCounts[restaurant.category] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Relatórios</h1>
          <p className="text-text">Dados atuais do Gastro Pass</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total de Usuários */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-text mb-1">Total de Usuários</p>
                <h3 className="text-2xl font-bold">{reportData?.totalUsers || 0}</h3>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-text">
              Usuários cadastrados no sistema
            </div>
          </div>
          
          {/* Total de Restaurantes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-text mb-1">Total de Restaurantes</p>
                <h3 className="text-2xl font-bold">{reportData?.totalRestaurants || 0}</h3>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Utensils className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 text-sm text-text">
              Restaurantes cadastrados na plataforma
            </div>
          </div>
        </div>
        
        {/* Tabelas */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Lista de Usuários */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Usuários Cadastrados</h3>
              <span className="flex items-center text-sm text-text">
                <CalendarDays className="w-4 h-4 mr-1" />
                Atualizado hoje
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Localidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData?.users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {user.location || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  ))}
                  {reportData?.users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-text">
                        Nenhum usuário cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Lista de Restaurantes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Restaurantes Cadastrados</h3>
              <span className="flex items-center text-sm text-text">
                <CalendarDays className="w-4 h-4 mr-1" />
                Atualizado hoje
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                      Localidade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData?.restaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors">
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
                  {reportData?.restaurants.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-text">
                        Nenhum restaurante cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 