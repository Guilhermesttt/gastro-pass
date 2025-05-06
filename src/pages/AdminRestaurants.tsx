
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlusCircle, Pencil, Trash, XCircle } from 'lucide-react';
import { getMockRestaurants, Restaurant } from '@/data/mockData';

const AdminRestaurants = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Partial<Restaurant> | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    location: '',
    address: '',
    phone: '',
    hours: '',
    rating: 4.5,
    discount: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    // In a real app, we would check if user is admin
    setIsAdmin(true);
    
    // Load restaurants from localStorage or fallback to mock data
    const storedRestaurants = localStorage.getItem('restaurants');
    if (storedRestaurants) {
      setRestaurants(JSON.parse(storedRestaurants));
    } else {
      const mockRestaurants = getMockRestaurants();
      setRestaurants(mockRestaurants);
      localStorage.setItem('restaurants', JSON.stringify(mockRestaurants));
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : value,
    });
  };

  const handleOpenForm = (restaurant?: Restaurant) => {
    if (restaurant) {
      setFormData({
        id: restaurant.id,
        name: restaurant.name,
        category: restaurant.category,
        location: restaurant.location,
        address: restaurant.address || '',
        phone: restaurant.phone || '',
        hours: restaurant.hours || '',
        rating: restaurant.rating,
        discount: restaurant.discount,
        description: restaurant.description || '',
        image: restaurant.image
      });
      setCurrentRestaurant(restaurant);
    } else {
      setFormData({
        id: `R${Math.floor(Math.random() * 1000)}`,
        name: '',
        category: '',
        location: '',
        address: '',
        phone: '',
        hours: '',
        rating: 4.5,
        discount: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
      });
      setCurrentRestaurant(null);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.location || !formData.category) {
      toast({
        variant: 'destructive',
        title: 'Erro no formulário',
        description: 'Por favor preencha todos os campos obrigatórios.',
      });
      return;
    }

    let updatedRestaurants: Restaurant[];
    
    if (currentRestaurant?.id) {
      // Update existing restaurant
      updatedRestaurants = restaurants.map(rest => 
        rest.id === formData.id ? formData as Restaurant : rest
      );
      
      toast({
        title: 'Restaurante atualizado',
        description: `${formData.name} foi atualizado com sucesso.`,
      });
    } else {
      // Add new restaurant
      updatedRestaurants = [...restaurants, formData as Restaurant];
      
      toast({
        title: 'Restaurante adicionado',
        description: `${formData.name} foi adicionado com sucesso.`,
      });
    }
    
    setRestaurants(updatedRestaurants);
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!currentRestaurant) return;
    
    const updatedRestaurants = restaurants.filter(
      restaurant => restaurant.id !== currentRestaurant.id
    );
    
    setRestaurants(updatedRestaurants);
    localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: 'Restaurante removido',
      description: `${currentRestaurant.name} foi removido com sucesso.`,
    });
  };

  const handleDeleteClick = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setIsDeleteDialogOpen(true);
  };

  if (!isAdmin) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gerenciar Restaurantes</h1>
            <p className="text-text">Adicione, edite ou remova restaurantes parceiros.</p>
          </div>
          
          <Button 
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Novo Restaurante
          </Button>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">{restaurant.id}</TableCell>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.category}</TableCell>
                    <TableCell>{restaurant.location}</TableCell>
                    <TableCell>{restaurant.discount}</TableCell>
                    <TableCell>{restaurant.rating.toFixed(1)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(restaurant)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(restaurant)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Add/Edit Restaurant Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentRestaurant ? `Editar Restaurante: ${currentRestaurant.name}` : 'Adicionar Novo Restaurante'}
              </DialogTitle>
              <DialogDescription>
                {currentRestaurant 
                  ? 'Modifique os detalhes do restaurante e clique em salvar quando terminar.'
                  : 'Preencha os detalhes do novo restaurante e clique em adicionar quando terminar.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome do Restaurante *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Categoria *
                  </label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Ex: Italiana • $$"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Bairro/Região *
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Endereço Completo
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="hours" className="text-sm font-medium">
                    Horário de Funcionamento
                  </label>
                  <Input
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="discount" className="text-sm font-medium">
                    Desconto/Benefício *
                  </label>
                  <Input
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Ex: 15% OFF"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="rating" className="text-sm font-medium">
                    Avaliação (1-5)
                  </label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    URL da Imagem
                  </label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descrição do Restaurante
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {currentRestaurant ? 'Salvar Alterações' : 'Adicionar Restaurante'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o restaurante "{currentRestaurant?.name}"? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminRestaurants;
