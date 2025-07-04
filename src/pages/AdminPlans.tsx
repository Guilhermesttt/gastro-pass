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
import {
  PlusCircle,
  Pencil,
  Trash,
  XCircle,
  BellRing,
  Clock,
  CheckCircle,
  Trash2,
  X
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  subscription?: {
    planId: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

const AdminPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan> | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    description: '',
    features: [''],
  });
  
  // Estado para controle da simulação de processos automatizados
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');
  const [processedUsers, setProcessedUsers] = useState<string[]>([]);

  useEffect(() => {
    // Verificar se o usuário está logado como admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/admin-login');
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
      navigate('/admin-login');
      return;
    }
    
    // Carregar planos do localStorage ou usar planos padrão
    const storedPlans = localStorage.getItem('plans');
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      const defaultPlans = [
        {
          id: 'basic',
          name: 'Básico',
          price: 19.90,
          description: 'Ideal para usuários individuais',
          features: [
            'Acesso a 20 restaurantes',
            'Descontos básicos',
            'Suporte por email'
          ]
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 39.90,
          description: 'Para usuários que desejam mais benefícios',
          features: [
            'Acesso a todos os restaurantes',
            'Descontos premium (até 30%)',
            'Suporte prioritário',
            'Cupons exclusivos mensais'
          ]
        },
        {
          id: 'family',
          name: 'Família',
          price: 59.90,
          description: 'Perfeito para toda a família',
          features: [
            'Acesso a todos os restaurantes',
            'Descontos premium (até 30%)',
            'Até 4 usuários',
            'Suporte prioritário 24/7',
            'Cupons exclusivos semanais'
          ]
        }
      ];
      setPlans(defaultPlans);
      localStorage.setItem('plans', JSON.stringify(defaultPlans));
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeatureField = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };

  const handleOpenForm = (plan?: Plan) => {
    if (plan) {
      setFormData({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: [...plan.features]
      });
      setCurrentPlan(plan);
    } else {
      setFormData({
        id: `plan_${Date.now().toString().slice(-6)}`,
        name: '',
        price: 0,
        description: '',
        features: ['']
      });
      setCurrentPlan(null);
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    if (!formData.name || formData.price <= 0) {
      toast({
        variant: 'destructive',
        title: 'Erro no formulário',
        description: 'Por favor preencha todos os campos obrigatórios.',
      });
      return;
    }

    // Filtrar recursos vazios
    const cleanedFeatures = formData.features.filter(feature => feature.trim() !== '');
    
    if (cleanedFeatures.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro no formulário',
        description: 'Adicione pelo menos um recurso ao plano.',
      });
      return;
    }

    const planData = {
      ...formData,
      features: cleanedFeatures
    };

    let updatedPlans: Plan[];
    
    if (currentPlan?.id) {
      // Atualizar plano existente
      updatedPlans = plans.map(p => 
        p.id === planData.id ? planData as Plan : p
      );
      
      toast({
        title: 'Plano atualizado',
        description: `${planData.name} foi atualizado com sucesso.`,
      });
    } else {
      // Adicionar novo plano
      updatedPlans = [...plans, planData as Plan];
      
      toast({
        title: 'Plano adicionado',
        description: `${planData.name} foi adicionado com sucesso.`,
      });
    }
    
    setPlans(updatedPlans);
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
    setIsFormOpen(false);
  };

  const handleDeleteClick = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!currentPlan) return;
    
    const updatedPlans = plans.filter(plan => plan.id !== currentPlan.id);
    
    setPlans(updatedPlans);
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: 'Plano removido',
      description: `${currentPlan.name} foi removido com sucesso.`,
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  // Funções de processamento automatizado
  const runAutomatedProcesses = async () => {
    setIsProcessing(true);
    setProcessStatus('Iniciando processamento automático...');
    setProcessedUsers([]);
    
    try {
      // Obter usuários
      const storedUsers = localStorage.getItem('users');
      if (!storedUsers) {
        setProcessStatus('Nenhum usuário encontrado.');
        setIsProcessing(false);
        return;
      }
      
      const users: User[] = JSON.parse(storedUsers);
      const processedResults: string[] = [];
      let updatedUsers = [...users];
      let notificationsCount = 0;
      
      // Simulação de data atual
      const today = new Date();
      
      setProcessStatus('Verificando status das assinaturas...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Processa cada usuário
      for (const user of users) {
        // Se o usuário tem assinatura
        if (user.subscription) {
          const endDate = new Date(user.subscription.endDate);
          const daysUntilExpiration = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // 1. Se o plano expirou
          if (daysUntilExpiration < 0 && user.subscription.status === 'ativo') {
            // Atualizar status para inativo
            const userIndex = updatedUsers.findIndex(u => u.id === user.id);
            updatedUsers[userIndex] = {
              ...user,
              subscription: {
                ...user.subscription,
                status: 'inativo'
              }
            };
            
            // Enviar notificação de expiração
            processedResults.push(`✉️ Enviado email "Seu plano expirou" para ${user.name} (${user.email})`);
            notificationsCount++;
            
            await new Promise(resolve => setTimeout(resolve, 300)); // Pequeno delay para visualização
          }
          
          // 2. Se o plano está prestes a expirar (3 dias)
          else if (daysUntilExpiration === 3 && user.subscription.status === 'ativo') {
            // Enviar notificação de lembrete
            processedResults.push(`⏰ Enviado email "Seu plano está quase acabando" para ${user.name} (${user.email})`);
            notificationsCount++;
            
            await new Promise(resolve => setTimeout(resolve, 300)); // Pequeno delay para visualização
          }
          
          // 3. Verificar pagamentos confirmados recentemente
          const payments = JSON.parse(localStorage.getItem('payments') || '[]');
          const userPayments = payments.filter((p: any) => 
            p.userId === user.id && 
            p.status === 'pago' && 
            !p.notificationSent
          );
          
          if (userPayments.length > 0) {
            // Atualizar status do usuário para ativo se não estiver
            if (user.subscription.status !== 'ativo') {
              const userIndex = updatedUsers.findIndex(u => u.id === user.id);
              updatedUsers[userIndex] = {
                ...user,
                subscription: {
                  ...user.subscription,
                  status: 'ativo'
                }
              };
            }
            
            // Enviar notificação de pagamento confirmado
            processedResults.push(`✅ Enviado email "Pagamento Confirmado" para ${user.name} (${user.email})`);
            notificationsCount++;
            
            // Marcar notificação como enviada
            const updatedPayments = payments.map((p: any) => {
              if (p.userId === user.id && p.status === 'pago' && !p.notificationSent) {
                return { ...p, notificationSent: true };
              }
              return p;
            });
            
            localStorage.setItem('payments', JSON.stringify(updatedPayments));
            await new Promise(resolve => setTimeout(resolve, 300)); // Pequeno delay para visualização
          }
        }
      }
      
      // Salvar usuários atualizados
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Finalizar processamento
      setProcessedUsers(processedResults);
      setProcessStatus(`Processamento concluído. ${notificationsCount} notificações enviadas.`);
      
      toast({
        title: 'Processamento automático concluído',
        description: `${notificationsCount} notificações foram enviadas.`,
      });
    } catch (error) {
      console.error('Erro durante o processamento automático:', error);
      setProcessStatus('Erro durante o processamento.');
    }
    
    setIsProcessing(false);
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
            <h1 className="text-xl lg:text-2xl font-bold mb-2">Gerenciar Planos</h1>
            <p className="text-text">Adicione, edite ou remova planos de assinatura.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <Button 
              onClick={runAutomatedProcesses}
              disabled={isProcessing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              {isProcessing ? (
                <>
                  <Clock size={16} className="animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <BellRing size={16} />
                  Processar Notificações
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2"
            >
              <PlusCircle size={16} />
              Novo Plano
            </Button>
          </div>
        </div>
        
        {/* Status do processamento */}
        {processStatus && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-lg font-medium mb-2 flex items-center">
              <CheckCircle size={18} className="text-green-500 mr-2" />
              Status do Processamento
            </h2>
            <p className="text-sm text-gray-500 mb-2">{processStatus}</p>
            
            {processedUsers.length > 0 && (
              <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded border text-sm">
                {processedUsers.map((message, index) => (
                  <div key={index} className="py-1 border-b border-gray-100 last:border-0">
                    {message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Tabela de Planos */}
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
                    Preço
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.length > 0 ? (
                  plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text-dark">{plan.id}</td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {plan.name}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        R$ {plan.price.toFixed(2)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-sm text-text">
                        {plan.description}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenForm(plan)}
                            className="flex items-center gap-1"
                          >
                            <Pencil size={14} />
                            <span className="hidden sm:inline">Editar</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(plan)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Excluir</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum plano cadastrado.
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
                {currentPlan ? 'Editar Plano' : 'Novo Plano'}
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
                    Preço
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recursos
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-md"
                          placeholder="Recurso do plano"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeatureField(index)}
                          className="shrink-0"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeatureField}
                      className="w-full"
                    >
                      Adicionar Recurso
                    </Button>
                  </div>
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
                    {currentPlan ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteDialogOpen && currentPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o plano {currentPlan.name}? Esta ação não pode ser desfeita.
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

export default AdminPlans; 