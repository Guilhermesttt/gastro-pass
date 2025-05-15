
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import RestaurantCard from '@/components/RestaurantCard';
import Footer from '@/components/Footer';
import UserAccountSection from '@/components/UserAccountSection';
import { Dialog } from '@/components/ui/dialog';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ComponentLoader } from '@/components/ui/component-loader';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search, MapPin, Star, User, Store, Info, AlertTriangle, X } from 'lucide-react';
import { getMockRestaurants, Restaurant } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useBenefit, getUserBenefits } from '@/lib/userBenefits';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<{name: string, email: string, location?: string} | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'restaurants' | 'account'>('restaurants');
  const [noRestaurantsInArea, setNoRestaurantsInArea] = useState(false);
  const [noRestaurants, setNoRestaurants] = useState(false);
  const [benefits, setBenefits] = useState(getUserBenefits());
  const [isLoading, setIsLoading] = useState(true);
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(false);
  const [isBenefitLoading, setIsBenefitLoading] = useState(false);
  
  // Estado para controlar a exibição do QR Code
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [qrCodeRestaurant, setQrCodeRestaurant] = useState<Restaurant | null>(null);

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
      
      // Simulate loading delay
      setIsLoading(true);
      
      setTimeout(() => {
        // Load restaurants from localStorage if available
        const storedRestaurants = localStorage.getItem('restaurants');
        if (storedRestaurants) {
          const parsedRestaurants = JSON.parse(storedRestaurants);
          
          if (parsedRestaurants.length === 0) {
            setNoRestaurants(true);
            setRestaurants([]);
            setFilteredRestaurants([]);
            setIsLoading(false);
            return;
          }
          
          setRestaurants(parsedRestaurants);
          
          // Se o usuário tiver localidade definida, filtra por padrão
          if (parsedUser.location) {
            setSelectedLocation(parsedUser.location);
            
            // Verifica se existem restaurantes na localidade do usuário
            const restaurantsInUserLocation = parsedRestaurants.filter(
              (r: Restaurant) => r.location === parsedUser.location
            );
            
            if (restaurantsInUserLocation.length === 0) {
              setNoRestaurantsInArea(true);
              setFilteredRestaurants(parsedRestaurants); // Mostra todos se não tiver na área
              toast({
                title: 'Sem restaurantes na sua área',
                description: 'Não encontramos restaurantes na sua região. Mostrando todas as opções.',
              });
            } else {
              setFilteredRestaurants(restaurantsInUserLocation);
            }
          } else {
            setFilteredRestaurants(parsedRestaurants);
          }
        } else {
          // Não há restaurantes cadastrados
          setNoRestaurants(true);
          setRestaurants([]);
          setFilteredRestaurants([]);
        }
        
        setIsLoading(false);

        // Welcome toast
        toast({
          title: 'Bem-vindo ao seu dashboard!',
          description: `Olá, ${parsedUser.name}! Veja os restaurantes disponíveis hoje.`,
        });
      }, 800); // Simulate loading delay
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate, toast]);

  // Extract unique locations for the filter
  const locations = [
    { value: 'all', label: 'Todos os Bairros' },
    ...Array.from(new Set(restaurants.map(r => r.location))).map(location => ({
      value: location,
      label: location
    }))
  ];

  // Filter restaurants when search, category or location changes
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
    
    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter((restaurant) =>
        restaurant.location === selectedLocation
      );
    }
    
    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCategory, selectedLocation, restaurants]);

  // Debounce search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setIsRestaurantLoading(true);
    setSelectedRestaurant(restaurant);
    
    // Simulate network delay for restaurant details
    setTimeout(() => {
      setIsRestaurantLoading(false);
      setIsModalOpen(true);
    }, 500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };
  
  // Função para exibir o QR code de um restaurante
  const handleQrCodeClick = (restaurant: Restaurant, event: React.MouseEvent) => {
    event.stopPropagation();
    setQrCodeRestaurant(restaurant);
    setIsQrCodeModalOpen(true);
  };
  
  // Função para fechar o modal de QR code
  const handleCloseQrCodeModal = () => {
    setIsQrCodeModalOpen(false);
    setQrCodeRestaurant(null);
  };

  const handleBenefitRedemption = (restaurant: any) => {
    setIsBenefitLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const result = useBenefit();
      setBenefits(getUserBenefits()); // Atualiza o estado dos benefícios
      
      if (result.success) {
        toast({
          title: 'Benefício resgatado!',
          description: result.message,
        });
        handleCloseModal();
      } else {
        toast({
          title: 'Benefícios esgotados',
          description: result.message,
          variant: 'destructive',
        });
        // Redireciona para a página de planos após 2 segundos
        setTimeout(() => {
          navigate('/plans');
        }, 2000);
      }
      
      setIsBenefitLoading(false);
    }, 1200);
  };

  // Show loading screen while checking auth and loading initial data
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <LoadingScreen text="Carregando seu dashboard..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-60 pb-16">
        <div className="container-custom">
          {/* User welcome section */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Olá, {user?.name}!</h1>
            <p className="text-foreground-light flex items-center">
              Bem-vindo ao seu espaço exclusivo no Gastro Pass.
              {user?.location && (
                <span className="ml-2 flex items-center text-primary">
                  <MapPin size={16} className="mr-1" />
                  {user.location}
                </span>
              )}
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-border mb-8">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={cn(
                "flex items-center px-6 py-3 font-medium transition-all duration-300",
                activeTab === 'restaurants'
                  ? "text-primary border-b-2 border-primary -mb-px hover:bg-primary/5"
                  : "text-foreground-light hover:text-primary hover:-translate-y-0.5"
              )}
            >
              <Store className="w-5 h-5 mr-2" />
              Restaurantes
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={cn(
                "flex items-center px-6 py-3 font-medium transition-all duration-300",
                activeTab === 'account'
                  ? "text-primary border-b-2 border-primary -mb-px hover:bg-primary/5"
                  : "text-foreground-light hover:text-primary hover:-translate-y-0.5"
              )}
            >
              <User className="w-5 h-5 mr-2" />
              Minha Conta
            </button>
          </div>
          
          {activeTab === 'account' ? (
            <UserAccountSection />
          ) : (
            <>
              {/* Aviso de localidade */}
              {user?.location && !noRestaurants && (
                <div className={cn(
                  "mb-4 p-3 rounded-lg flex items-start gap-3",
                  noRestaurantsInArea ? "bg-yellow-50 border border-yellow-200" : "bg-green-50 border border-green-200"
                )}>
                  <Info size={20} className={noRestaurantsInArea ? "text-yellow-600 mt-0.5" : "text-green-600 mt-0.5"} />
                  <div>
                    {noRestaurantsInArea ? (
                      <>
                        <p className="text-yellow-800 font-medium">Sem restaurantes na sua região</p>
                        <p className="text-yellow-700 text-sm">Não encontramos restaurantes em {user.location}. Mostrando todas as opções disponíveis.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-green-800 font-medium">Restaurantes na sua região</p>
                        <p className="text-green-700 text-sm">Mostrando restaurantes em {user.location}. Use os filtros para ver mais opções.</p>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Alerta quando não há restaurantes */}
              {noRestaurants && (
                <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-4">
                  <AlertTriangle size={24} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium text-lg">Não há restaurantes cadastrados</p>
                    <p className="text-yellow-700 mt-2">
                      No momento, não há restaurantes cadastrados no sistema. 
                      Por favor, entre em contato com o administrador para mais informações.
                    </p>
                  </div>
                </div>
              )}
            
              {/* Filters and search */}
              {!noRestaurants && (
                <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Buscar restaurantes..."
                        className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:shadow-sm focus:shadow-md"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:shadow-sm hover:border-gray-400"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:shadow-sm hover:border-gray-400"
                      >
                        {locations.map((location) => (
                          <option key={location.value} value={location.value}>
                            {location.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Restaurant grid */}
              {!noRestaurants && filteredRestaurants.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      id={restaurant.id}
                      name={restaurant.name}
                      image={restaurant.image}
                      category={restaurant.category}
                      location={restaurant.location}
                      address={restaurant.address}
                      rating={restaurant.rating}
                      discount={restaurant.discount}
                      qrCode={restaurant.qrCode}
                      onClick={() => handleRestaurantClick(restaurant)}
                      onQrCodeClick={(e) => handleQrCodeClick(restaurant, e)}
                    />
                  ))}
                </div>
              ) : !noRestaurants ? (
                <div className="text-center py-16">
                  <p className="text-lg text-foreground-light">Nenhum restaurante encontrado. Tente outra busca.</p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>
      
      {/* Restaurant detail modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {isRestaurantLoading ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-8">
              <div className="flex flex-col items-center justify-center">
                <LoadingSpinner size={32} text="Carregando detalhes do restaurante..." />
              </div>
            </div>
          </div>
        ) : selectedRestaurant && (
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
                  className="absolute top-4 right-4 rounded-full bg-white p-1.5 hover:bg-gray-200 transition-all duration-200 hover:rotate-90 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                <h3 className="text-2xl font-bold mb-2">{selectedRestaurant.name}</h3>
                
                <div className="flex items-center text-sm mb-4">
                  <span className="flex items-center mr-4">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {selectedRestaurant.rating}
                  </span>
                  <span className="mr-4">{selectedRestaurant.category}</span>
                </div>
                
                <div className="flex items-start mb-4">
                  <MapPin className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">{selectedRestaurant.location}</p>
                    {selectedRestaurant.address && (
                      <p className="text-foreground-light">{selectedRestaurant.address}</p>
                    )}
                  </div>
                </div>
                
                {selectedRestaurant.description && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Sobre o restaurante</h4>
                    <p className="text-foreground-light">
                      {selectedRestaurant.description || "Experimente os pratos especiais deste restaurante e aproveite nosso desconto exclusivo para membros."}
                    </p>
                  </div>
                )}
                
                <div className="bg-background p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2">Benefício exclusivo</h4>
                  <p className="text-lg font-semibold text-primary">
                    {selectedRestaurant.discount}
                  </p>
                  <p className="text-sm text-foreground-light">
                    Válido para todos os dias mediante apresentação do app.
                  </p>
                </div>
                
                <button
                  onClick={() => handleBenefitRedemption(selectedRestaurant)}
                  className="btn btn-primary w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transform hover:bg-primary-dark shine-effect relative overflow-hidden"
                  disabled={isBenefitLoading}
                >
                  {isBenefitLoading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size={18} />
                      <span className="ml-2">Processando...</span>
                    </span>
                  ) : (
                    <>
                      Resgatar Benefício
                      <span className="shine"></span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      
      {/* QR Code Modal */}
      <Dialog open={isQrCodeModalOpen} onOpenChange={setIsQrCodeModalOpen}>
        {qrCodeRestaurant && qrCodeRestaurant.qrCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg max-w-md w-full overflow-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">QR Code - {qrCodeRestaurant.name}</h3>
                <button
                  onClick={handleCloseQrCodeModal}
                  className="rounded-full bg-gray-100 p-1.5 transition-all duration-200 hover:bg-gray-200 hover:rotate-90 hover:scale-110"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border mb-4">
                  <QRCodeSVG 
                    value={qrCodeRestaurant.qrCode} 
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Apresente este QR code ao estabelecimento para obter seu desconto:{" "}
                  <span className="font-semibold text-foreground">{qrCodeRestaurant.discount}</span>
                </p>
                
                <Button
                  onClick={() => {
                    // Criar um elemento canvas temporário para fazer o download
                    const canvas = document.querySelector("canvas");
                    if (canvas) {
                      const link = document.createElement("a");
                      link.href = canvas.toDataURL("image/png");
                      link.download = `qrcode-${qrCodeRestaurant.id}.png`;
                      link.click();
                    }
                  }}
                  className="btn-secondary w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 shine-effect"
                >
                  Baixar QR Code
                </Button>
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
