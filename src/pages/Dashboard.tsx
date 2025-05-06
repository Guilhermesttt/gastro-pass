import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import RestaurantCard from '@/components/RestaurantCard';
import Footer from '@/components/Footer';
import { Dialog } from '@/components/ui/dialog';
import { Search, MapPin, Bell, Star } from 'lucide-react';
import { getMockRestaurants, Restaurant } from '@/data/mockData';

// Use the Restaurant interface from mockData.ts
// Removing the local Restaurant interface since we're importing it

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories for filter
  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'Italiana', label: 'Italiana' },
    { value: 'Japonesa', label: 'Japonesa' },
    { value: 'Brasileira', label: 'Brasileira' },
    { value: 'Hamburgeria', label: 'Hamburgeria' },
    { value: 'Mexicana', label: 'Mexicana' },
    { value: 'Vegetariana', label: 'Vegetariana' },
  ];

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load restaurants
      const allRestaurants = getMockRestaurants();
      setRestaurants(allRestaurants);
      setFilteredRestaurants(allRestaurants);

      // Welcome toast
      toast({
        title: 'Bem-vindo ao seu dashboard!',
        description: `Olá, ${parsedUser.name}! Veja os restaurantes disponíveis hoje.`,
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate, toast]);

  // Filter restaurants when search or category changes
  useEffect(() => {
    let filtered = [...restaurants];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((restaurant) =>
        restaurant.category.includes(selectedCategory)
      );
    }
    
    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCategory, restaurants]);

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container-custom">
          {/* User welcome section */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Olá, {user?.name}!</h1>
            <p className="text-text">Descubra os restaurantes parceiros e seus benefícios exclusivos.</p>
          </div>
          
          {/* Filters and search */}
          <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar restaurantes..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="flex-shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Restaurant grid */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  id={restaurant.id}
                  name={restaurant.name}
                  image={restaurant.image}
                  category={restaurant.category}
                  location={restaurant.location}
                  rating={restaurant.rating}
                  discount={restaurant.discount}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-text">Nenhum restaurante encontrado. Tente outra busca.</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Restaurant detail modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedRestaurant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="relative">
                <img
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 rounded-full bg-white p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary text-black font-medium px-3 py-1 rounded-md text-sm">
                      {selectedRestaurant.discount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <Star size={18} className="fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{selectedRestaurant.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-sm text-text mb-6">{selectedRestaurant.category}</p>

                <div className="flex items-start gap-2 mb-4 text-text">
                  <MapPin size={18} className="mt-1 flex-shrink-0" />
                  <p>{selectedRestaurant.address || selectedRestaurant.location}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Descrição</h3>
                  <p className="text-text">
                    {selectedRestaurant.description || 
                      "Este restaurante parceiro oferece benefícios exclusivos para membros do RestoBenefícios. Apresente seu cartão virtual no aplicativo para obter descontos e vantagens especiais."}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Detalhes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-light">Telefone</p>
                      <p>{selectedRestaurant.phone || "(11) 3456-7890"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-light">Horário</p>
                      <p>{selectedRestaurant.hours || "12h às 23h"}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toast({
                      title: 'Benefício resgatado!',
                      description: `Você resgatou o benefício de ${selectedRestaurant.discount} no ${selectedRestaurant.name}`,
                    });
                    handleCloseModal();
                  }}
                  className="btn btn-primary w-full"
                >
                  Resgatar Benefício
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
