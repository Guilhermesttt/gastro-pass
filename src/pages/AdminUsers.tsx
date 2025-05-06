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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 lg:p-8 w-full lg:ml-64">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold mb-2">Gerenciar Usuários</h1>
            <p className="text-text">Adicione, edite ou remova usuários do sistema.</p>
          </div>
          
          <Button 
            onClick={() => handleOpenForm()}
            className="flex items-center gap-2 w-full lg:w-auto"
          >
            <PlusCircle size={16} />
            Novo Usuário
          </Button>
        </div>
        
        {/* Tabela de Usuários */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                    Email
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text-dark">{user.id}</td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        {user.email}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        {user.isAdmin ? 'Administrador' : 'Usuário'}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        <div className="flex gap-2">
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
                            className="flex items-center gap-1"
                          >
                            <Pencil size={14} />
                            <span className="hidden sm:inline">Editar</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            className="flex items-center gap-1"
                          >
                            <Trash size={14} />
                            <span className="hidden sm:inline">Excluir</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum usuário cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {currentUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required={!currentUser}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Administrador
                  </label>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {currentUser ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteDialogOpen && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o usuário {currentUser.name}? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-2">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 