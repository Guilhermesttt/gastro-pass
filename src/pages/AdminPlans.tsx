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
  CheckCircle
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
    <div className="flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gerenciar Planos</h1>
            <p className="text-text">Adicione, edite ou remova planos de assinatura.</p>
          </div>
          
          <div className="flex gap-2">
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
        {(isProcessing || processedUsers.length > 0) && (
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Recursos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.id}</TableCell>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{formatCurrency(plan.price)}</TableCell>
                    <TableCell>{plan.description}</TableCell>
                    <TableCell>
                      <div className="max-h-16 overflow-y-auto">
                        <ul className="list-disc list-inside text-sm">
                          {plan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(plan)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(plan)}
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
        
        {/* Modelos de Email */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Modelos de Email</h2>
            <p className="text-sm text-gray-500">Emails enviados automaticamente aos clientes.</p>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">1. Pagamento Confirmado</h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>Assunto:</strong> Pagamento Confirmado</p>
                <p className="mt-2"><strong>Corpo:</strong></p>
                <div className="mt-1 pl-4 border-l-2 border-gray-300">
                  Olá, [NOME_DO_CLIENTE]!<br/>
                  Recebemos o seu pagamento. Seu plano está ativo e você já pode aproveitar os benefícios exclusivos nos restaurantes parceiros.<br/>
                  Aproveite!
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">2. Aviso de Vencimento (3 dias antes)</h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>Assunto:</strong> Seu plano está quase acabando</p>
                <p className="mt-2"><strong>Corpo:</strong></p>
                <div className="mt-1 pl-4 border-l-2 border-gray-300">
                  Olá, [NOME_DO_CLIENTE]!<br/>
                  Seu plano atual está prestes a expirar. Renove agora para continuar aproveitando os benefícios dos nossos restaurantes parceiros.<br/>
                  Clique aqui para renovar: [LINK_PARA_RENOVAR]
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">3. Plano Expirado</h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>Assunto:</strong> Seu plano expirou</p>
                <p className="mt-2"><strong>Corpo:</strong></p>
                <div className="mt-1 pl-4 border-l-2 border-gray-300">
                  Olá, [NOME_DO_CLIENTE].<br/>
                  Seu plano expirou e você perdeu o acesso aos benefícios.<br/>
                  Para reativar, clique aqui: [LINK_PARA_REATIVAR]
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulário para adicionar/editar plano */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{currentPlan ? 'Editar Plano' : 'Adicionar Novo Plano'}</DialogTitle>
              <DialogDescription>
                {currentPlan ? 'Edite as informações do plano abaixo.' : 'Preencha os detalhes do novo plano.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nome do Plano*</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Básico, Premium, etc."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">Preço (R$)*</label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Ex: 19.90"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Descrição*</label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descreva o plano brevemente..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Recursos*</label>
                <p className="text-xs text-gray-500">Adicione os recursos incluídos neste plano</p>
                
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Ex: Acesso a todos os restaurantes"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeatureField(index)}
                      >
                        <XCircle size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeatureField}
                  className="mt-2"
                >
                  Adicionar Recurso
                </Button>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Plano</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Dialog de confirmação para excluir */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover Plano</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover este plano? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            
            {currentPlan && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2 my-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nome:</span>
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Preço:</span>
                  <span className="font-medium">{formatCurrency(currentPlan.price || 0)}</span>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPlans; 