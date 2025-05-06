import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Trash, Pencil, PlusCircle, ShieldCheck, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  isAdmin: boolean;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    isAdmin: false
  });

  useEffect(() => {
    // Verificar se o usuário está logado e é admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser.isAdmin) {
        navigate('/dashboard');
        return;
      }
      setIsAdmin(true);
      
      // Carregar usuários do localStorage
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Inicializar com array vazio se não houver usuários
        localStorage.setItem('users', JSON.stringify([]));
        setUsers([]);
      }
    } catch (error) {
      console.error('Erro ao verificar permissões de admin:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Corrigir o tipo para permitir acesso ao checked
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleOpenForm = (user?: User) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password || '',
        isAdmin: user.isAdmin
      });
      setCurrentUser(user);
    } else {
      setFormData({
        id: `U${Math.floor(Math.random() * 1000)}`,
        name: '',
        email: '',
        password: '',
        isAdmin: false
      });
      setCurrentUser(null);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    if (!formData.name || !formData.email) {
      toast({
        variant: 'destructive',
        title: 'Erro no formulário',
        description: 'Por favor preencha todos os campos obrigatórios.',
      });
      return;
    }

    // Validar email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        variant: 'destructive',
        title: 'Email inválido',
        description: 'Por favor forneça um email válido.',
      });
      return;
    }

    // Validar senha para novos usuários
    if (!currentUser && (!formData.password || formData.password.length < 6)) {
      toast({
        variant: 'destructive',
        title: 'Senha inválida',
        description: 'A senha deve ter pelo menos 6 caracteres.',
      });
      return;
    }

    let updatedUsers: User[];
    
    if (currentUser?.id) {
      // Atualizar usuário existente
      updatedUsers = users.map(user => 
        user.id === formData.id ? {
          ...formData,
          password: formData.password || user.password,
          createdAt: user.createdAt
        } as User : user
      );
      
      toast({
        title: 'Usuário atualizado',
        description: `${formData.name} foi atualizado com sucesso.`,
      });
    } else {
      // Adicionar novo usuário
      updatedUsers = [...users, {
        ...formData,
        createdAt: new Date().toISOString()
      } as User];
      
      toast({
        title: 'Usuário adicionado',
        description: `${formData.name} foi adicionado com sucesso.`,
      });
    }
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!currentUser) return;
    
    const updatedUsers = users.filter(
      user => user.id !== currentUser.id
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: 'Usuário removido',
      description: `${currentUser.name} foi removido com sucesso.`,
    });
  };

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const toggleAdminStatus = (user: User) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          isAdmin: !u.isAdmin
        };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    toast({
      title: `Permissões alteradas`,
      description: `${user.name} agora ${!user.isAdmin ? 'é' : 'não é'} um administrador.`,
    });
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
            <h1 className="text-2xl font-bold mb-2">Gerenciar Usuários</h1>
            <p className="text-text">Adicione, edite ou remova usuários do sistema.</p>
          </div>
          
          <Button 
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Novo Usuário
          </Button>
        </div>
        
        {/* Tabela de Usuários */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum usuário cadastrado. Clique em "Novo Usuário" para adicionar.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.createdAt 
                          ? new Date(user.createdAt).toLocaleDateString('pt-BR') 
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isAdmin 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'Usuário'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAdminStatus(user)}
                            className={user.isAdmin ? "text-yellow-500" : "text-blue-500"}
                            title={user.isAdmin ? "Remover privilégios de admin" : "Tornar administrador"}
                          >
                            {user.isAdmin ? <Shield size={16} /> : <ShieldCheck size={16} />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenForm(user)}
                            title="Editar usuário"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-500 hover:text-red-700"
                            title="Remover usuário"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Diálogo de Adicionar/Editar Usuário */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {currentUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {currentUser 
                  ? 'Modifique os detalhes do usuário e clique em salvar quando terminar.'
                  : 'Preencha os detalhes do novo usuário. Todos os campos com * são obrigatórios.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome completo do usuário"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha {!currentUser && '*'}
                    {currentUser && <span className="text-xs text-gray-500 ml-1">(Deixe em branco para manter a mesma)</span>}
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={currentUser ? '••••••' : 'Mínimo de 6 caracteres'}
                    required={!currentUser}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    id="isAdmin"
                    name="isAdmin"
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700">
                    Este usuário é um administrador
                  </label>
                </div>
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
                  {currentUser ? 'Salvar Alterações' : 'Adicionar Usuário'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Diálogo de Confirmação de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir o usuário <strong>{currentUser?.name}</strong>?
                Esta ação não pode ser desfeita.
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

export default AdminUsers; 