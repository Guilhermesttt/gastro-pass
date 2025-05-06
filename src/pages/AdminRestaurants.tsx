import { useState, useEffect, useRef } from 'react';
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
import { 
  PlusCircle, 
  Pencil, 
  Trash, 
  XCircle, 
  Clock, 
  Image as ImageIcon,
  Upload,
  RefreshCw
} from 'lucide-react';
import { getMockRestaurants, Restaurant } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Opções de horários pré-definidas
const timeSlots = {
  morning: [
    { id: "morning-1", label: "07:00 - 12:00", value: "07:00 - 12:00" },
    { id: "morning-2", label: "08:00 - 12:00", value: "08:00 - 12:00" },
    { id: "morning-3", label: "09:00 - 12:00", value: "09:00 - 12:00" },
    { id: "morning-4", label: "10:00 - 14:00", value: "10:00 - 14:00" },
  ],
  afternoon: [
    { id: "afternoon-1", label: "12:00 - 15:00", value: "12:00 - 15:00" },
    { id: "afternoon-2", label: "12:00 - 16:00", value: "12:00 - 16:00" },
    { id: "afternoon-3", label: "12:00 - 18:00", value: "12:00 - 18:00" },
  ],
  night: [
    { id: "night-1", label: "18:00 - 22:00", value: "18:00 - 22:00" },
    { id: "night-2", label: "18:00 - 23:00", value: "18:00 - 23:00" },
    { id: "night-3", label: "19:00 - 23:00", value: "19:00 - 23:00" },
  ],
  fullDay: [
    { id: "full-1", label: "10:00 - 22:00", value: "10:00 - 22:00" },
    { id: "full-2", label: "11:00 - 23:00", value: "11:00 - 23:00" },
    { id: "full-3", label: "24 horas", value: "24 horas" },
  ]
};

// Imagem padrão para restaurantes sem imagem
const defaultImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80";

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

const AdminRestaurants = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
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
    image: defaultImage,
    estado: '' // Novo campo para o estado
  });
  
  // Estado para o filtro de estados
  const [filterEstado, setFilterEstado] = useState<string>('');
  
  // Estado para controle do tipo de horário selecionado
  const [selectedTimeSlotType, setSelectedTimeSlotType] = useState<string>("fullDay");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(timeSlots.fullDay[0].value);
  
  // Estados para o upload de imagem
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/login');
      return;
    }
    
    // Load restaurants from localStorage or fallback to mock data
    const storedRestaurants = localStorage.getItem('restaurants');
    if (storedRestaurants) {
      const parsedRestaurants = JSON.parse(storedRestaurants);
      setRestaurants(parsedRestaurants);
      setFilteredRestaurants(parsedRestaurants);
    } else {
      const mockRestaurants = getMockRestaurants();
      setRestaurants(mockRestaurants);
      setFilteredRestaurants(mockRestaurants);
      localStorage.setItem('restaurants', JSON.stringify(mockRestaurants));
    }
  }, [navigate]);

  // Efeito para filtrar os restaurantes quando o filtro de estado mudar
  useEffect(() => {
    if (!filterEstado) {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => 
        restaurant.estado === filterEstado
      );
      setFilteredRestaurants(filtered);
    }
  }, [filterEstado, restaurants]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating' ? parseFloat(value) : value,
    });
  };

  // Handler para alterações no horário
  const handleTimeSlotChange = (value: string) => {
    setSelectedTimeSlot(value);
    setFormData({
      ...formData,
      hours: value
    });
  };

  // Handler para alterações no tipo de horário (manhã, tarde, etc)
  const handleTimeSlotTypeChange = (value: string) => {
    setSelectedTimeSlotType(value);
    // Selecionar o primeiro slot do novo tipo
    const firstSlot = timeSlots[value as keyof typeof timeSlots][0].value;
    setSelectedTimeSlot(firstSlot);
    setFormData({
      ...formData,
      hours: firstSlot
    });
  };

  // Função para processar o upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar o tipo de arquivo
    if (!file.type.match('image.*')) {
      toast({
        variant: 'destructive',
        title: 'Formato inválido',
        description: 'Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc).',
      });
      return;
    }

    // Verificar o tamanho do arquivo (máx. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 5MB.',
      });
      return;
    }

    setIsUploading(true);
    
    // Converter a imagem para base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setFormData({
        ...formData,
        image: base64
      });
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: 'Ocorreu um erro ao processar a imagem.',
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Função para resetar o input de arquivo
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para acionar o click no input de arquivo
  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
        hours: restaurant.hours || timeSlots.fullDay[0].value,
        rating: restaurant.rating,
        discount: restaurant.discount,
        description: restaurant.description || '',
        image: restaurant.image,
        estado: restaurant.estado || '' // Recuperar o estado do restaurante
      });
      
      // Definir visualização da imagem
      setImagePreview(restaurant.image);
      
      // Detectar qual tipo de horário está selecionado
      let foundTimeSlotType = false;
      Object.entries(timeSlots).forEach(([type, slots]) => {
        const matchingSlot = slots.find(slot => slot.value === restaurant.hours);
        if (matchingSlot) {
          setSelectedTimeSlotType(type);
          setSelectedTimeSlot(matchingSlot.value);
          foundTimeSlotType = true;
        }
      });
      
      // Se não encontrar correspondência, usar o valor padrão
      if (!foundTimeSlotType) {
        setSelectedTimeSlotType("fullDay");
        setSelectedTimeSlot(timeSlots.fullDay[0].value);
      }
      
      setCurrentRestaurant(restaurant);
    } else {
      // Valores padrão para novo restaurante
      setFormData({
        id: `R${Math.floor(Math.random() * 1000)}`,
        name: '',
        category: '',
        location: '',
        address: '',
        phone: '',
        hours: timeSlots.fullDay[0].value,
        rating: 4.5,
        discount: '',
        description: '',
        image: defaultImage,
        estado: '' // Estado vazio para novo restaurante
      });
      setImagePreview(defaultImage);
      setSelectedTimeSlotType("fullDay");
      setSelectedTimeSlot(timeSlots.fullDay[0].value);
      setCurrentRestaurant(null);
    }
    resetFileInput();
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
        
        {/* Filtro de Estado */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-auto">
              <label htmlFor="filter-estado" className="block text-sm font-medium text-foreground mb-1">
                Filtrar por Estado
              </label>
              <select
                id="filter-estado"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full md:w-60 px-3 py-2 border rounded-md bg-white"
              >
                <option value="">Todos os Estados</option>
                {estadosBrasileiros.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-auto self-end">
              <p className="text-sm text-muted-foreground">
                {filteredRestaurants.length} restaurante(s) encontrado(s)
              </p>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRestaurants.length > 0 ? (
                  filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell className="font-medium">{restaurant.id}</TableCell>
                      <TableCell>{restaurant.name}</TableCell>
                      <TableCell>
                        {restaurant.estado ? 
                          estadosBrasileiros.find(e => e.value === restaurant.estado)?.label || restaurant.estado 
                          : '-'}
                      </TableCell>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      Nenhum restaurante encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Add/Edit Restaurant Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
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
            
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {/* Linha 1: Nome e Categoria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-medium text-foreground">
                    Nome do Restaurante *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-card"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="category" className="block text-sm font-medium text-foreground">
                    Categoria *
                  </label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Ex: Italiana • $$"
                    required
                    className="bg-card"
                  />
                </div>
              </div>

              {/* Linha 2: Estado e Bairro/Região */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label htmlFor="estado" className="block text-sm font-medium text-foreground">
                    Estado *
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md bg-card"
                  >
                    <option value="">Selecione o estado</option>
                    {estadosBrasileiros.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="location" className="block text-sm font-medium text-foreground">
                    Bairro/Região *
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="bg-card"
                  />
                </div>
              </div>

              {/* Linha 3: Endereço Completo */}
              <div className="space-y-1">
                <label htmlFor="address" className="block text-sm font-medium text-foreground">
                  Endereço Completo
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-card"
                />
              </div>

              {/* Linha 4: Telefone e Desconto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-card"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="discount" className="block text-sm font-medium text-foreground">
                    Desconto/Benefício *
                  </label>
                  <Input
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Ex: 15% OFF"
                    required
                    className="bg-card"
                  />
                </div>
              </div>

              {/* Horário de Funcionamento com opções pré-definidas */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock size={18} className="mr-2 text-primary" />
                  <label className="text-sm font-medium text-foreground">
                    Horário de Funcionamento
                  </label>
                </div>
                
                <Tabs 
                  value={selectedTimeSlotType} 
                  onValueChange={handleTimeSlotTypeChange}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="morning">Manhã</TabsTrigger>
                    <TabsTrigger value="afternoon">Tarde</TabsTrigger>
                    <TabsTrigger value="night">Noite</TabsTrigger>
                    <TabsTrigger value="fullDay">Dia Todo</TabsTrigger>
                  </TabsList>
                  
                  {Object.entries(timeSlots).map(([type, slots]) => (
                    <TabsContent key={type} value={type} className="mt-0">
                      <RadioGroup 
                        value={selectedTimeSlot}
                        onValueChange={handleTimeSlotChange}
                        className="grid grid-cols-2 gap-4"
                      >
                        {slots.map((slot) => (
                          <div key={slot.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={slot.value} id={slot.id} />
                            <Label htmlFor={slot.id}>{slot.label}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Avaliação */}
              <div className="space-y-1">
                <label htmlFor="rating" className="block text-sm font-medium text-foreground">
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
                  className="bg-card"
                />
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <ImageIcon size={18} className="mr-2 text-primary" />
                  <label className="text-sm font-medium text-foreground">
                    Imagem do Restaurante
                  </label>
                </div>
                
                {/* Input de arquivo escondido */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden"
                  ref={fileInputRef}
                />
                
                {/* Botão para acionar o input de arquivo */}
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    onClick={triggerFileInput}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Fazer Upload de Imagem
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Visualização da imagem */}
                <div className="mt-4 rounded-lg overflow-hidden border">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Visualização da imagem"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-400">Nenhuma imagem selecionada</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Linha 5: Descrição do Restaurante */}
              <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                  Descrição do Restaurante
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="bg-card"
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFormOpen(false)}
                  className="hover:bg-border"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="btn-primary">
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
