import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, CreditCard, Check, Calendar, Shield, Loader2, RefreshCw } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface Payment {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'pendente' | 'pago' | 'cancelado';
  planId: string;
  userId: string;
}

const ManageSubscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Erro ao analisar dados do usuário:', error);
        return null;
      }
    }
    return null;
  });
  
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  
  // Planos disponíveis
  const plans: Plan[] = [
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

  useEffect(() => {
    if (user) {
      // Carregar pagamentos do usuário
      const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      const userPayments = allPayments.filter((payment: Payment) => payment.userId === user.id);
      setPayments(userPayments);
      
      // Verificar plano atual
      if (user.subscription) {
        setCurrentPlan(plans.find(p => p.id === user.subscription.planId));
        setSelectedPlan(user.subscription.planId);
      } else {
        setSelectedPlan('basic');
      }
    }
  }, [user]);
  
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleSubscribe = () => {
    const selectedPlanData = plans.find(p => p.id === selectedPlan);
    
    if (!selectedPlanData || !user) return;
    
    // Gerar ID único para o pagamento
    const paymentId = 'payment_' + Date.now();
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    
    // Criar novo registro de pagamento
    const newPayment: Payment = {
      id: paymentId,
      date: formattedDate,
      description: `Assinatura ${selectedPlanData.name} - ${today.toLocaleString('pt-BR', { month: 'short', year: 'numeric' })}`,
      amount: selectedPlanData.price,
      status: 'pendente',
      planId: selectedPlanData.id,
      userId: user.id
    };
    
    // Adicionar no localStorage
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    allPayments.push(newPayment);
    localStorage.setItem('payments', JSON.stringify(allPayments));
    
    // Atualizar estado local
    setPayments(prev => [...prev, newPayment]);
    
    // Atualizar objeto do usuário
    const updatedUser = {
      ...user,
      paymentPending: {
        paymentId,
        planId: selectedPlanData.id
      }
    };
    
    // Salvar no localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Construir mensagem para WhatsApp
    const message = `Olá! Eu sou ${user.name} (${user.email}) e gostaria de assinar o plano ${selectedPlanData.name} do GastroPass por R$ ${selectedPlanData.price.toFixed(2)}/mês. ID do pagamento: ${paymentId}. Por favor, me envie instruções para pagamento.`;
    
    // Número de telefone para onde enviar a mensagem
    const phoneNumber = "5567998354747"; // Substitua pelo número real
    
    // Criar o link do WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Mostrar mensagem de confirmação
    toast({
      title: 'Redirecionando para pagamento',
      description: `Você será redirecionado para o WhatsApp para finalizar o pagamento do plano ${selectedPlanData.name}.`,
    });
    
    // Abrir WhatsApp em uma nova aba
    window.open(whatsappURL, '_blank');
  };
  
  const checkPaymentStatus = () => {
    setIsCheckingStatus(true);
    
    // Simulação de verificação de status
    setTimeout(() => {
      // Verificar se existe pagamento pendente aprovado pelo admin
      const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
      const pendingPayment = user.paymentPending ? allPayments.find((p: Payment) => p.id === user.paymentPending.paymentId) : null;
      
      if (pendingPayment && pendingPayment.status === 'pago') {
        // Atualizar usuário com assinatura ativa
        const updatedUser = {
          ...user,
          subscription: {
            planId: pendingPayment.planId,
            startDate: new Date().toISOString(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            status: 'ativo'
          },
          paymentPending: null
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        const planName = plans.find(p => p.id === pendingPayment.planId)?.name;
        
        toast({
          title: 'Pagamento confirmado!',
          description: `Seu plano ${planName} foi ativado com sucesso.`,
        });
        
        // Recarregar pagamentos
        const userPayments = allPayments.filter((payment: Payment) => payment.userId === user.id);
        setPayments(userPayments);
        
        // Atualizar plano atual
        setCurrentPlan(plans.find(p => p.id === pendingPayment.planId));
      } else if (pendingPayment) {
        toast({
          title: 'Pagamento pendente',
          description: 'Seu pagamento ainda está sendo processado. Tente novamente mais tarde.',
        });
      } else {
        toast({
          title: 'Nenhum pagamento pendente',
          description: 'Você não tem pagamentos pendentes para verificar.',
        });
      }
      
      setIsCheckingStatus(false);
    }, 1500); // Simulação de delay de API
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  // Determinar o status da assinatura para exibição
  const subscriptionStatus = user.subscription 
    ? { status: 'ativo', planName: plans.find(p => p.id === user.subscription.planId)?.name || 'Básico' }
    : (user.paymentPending 
      ? { status: 'pendente', planName: plans.find(p => p.id === user.paymentPending.planId)?.name || 'Básico' }
      : { status: 'inativo', planName: 'Nenhum' });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center text-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Voltar ao Dashboard</span>
          </button>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Gerenciar assinatura</h1>
                  <p className="text-sm text-foreground-light">Escolha o plano ideal para você</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium">Status da sua assinatura</h2>
                  {user.paymentPending && (
                    <button 
                      onClick={checkPaymentStatus}
                      className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                      disabled={isCheckingStatus}
                    >
                      {isCheckingStatus ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          <span>Verificando...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          <span>Verificar status</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      subscriptionStatus.status === 'ativo' 
                        ? 'bg-green-100' 
                        : subscriptionStatus.status === 'pendente' 
                          ? 'bg-yellow-100' 
                          : 'bg-gray-100'
                    }`}>
                      <Shield className={`w-5 h-5 ${
                        subscriptionStatus.status === 'ativo' 
                          ? 'text-green-600' 
                          : subscriptionStatus.status === 'pendente' 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        subscriptionStatus.status === 'ativo' 
                          ? 'text-green-700' 
                          : subscriptionStatus.status === 'pendente' 
                            ? 'text-yellow-700' 
                            : 'text-gray-700'
                      }`}>
                        Plano {subscriptionStatus.planName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {subscriptionStatus.status === 'ativo' ? (
                          'Ativo até 15/12/2023 · Renovação automática'
                        ) : subscriptionStatus.status === 'pendente' ? (
                          'Pagamento pendente · Aguardando confirmação'
                        ) : (
                          'Nenhuma assinatura ativa'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            
              <h2 className="text-lg font-medium mb-6">Escolha seu plano</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`border rounded-lg p-5 cursor-pointer transition-all hover:shadow-md ${
                      selectedPlan === plan.id ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedPlan === plan.id ? 'bg-primary text-white' : 'border border-gray-300'
                      }`}>
                        {selectedPlan === plan.id && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</span>
                      <span className="text-gray-500 text-sm"> /mês</span>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 border-t border-gray-100 p-4 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Cobrança mensal · Cancele a qualquer momento</span>
                  </div>
                  <button
                    onClick={handleSubscribe}
                    className="btn btn-primary"
                    disabled={isCheckingStatus || (user.paymentPending && selectedPlan === user.paymentPending.planId)}
                  >
                    {user.paymentPending && selectedPlan === user.paymentPending.planId ? 
                      'Pagamento pendente' : 'Pagar via WhatsApp'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Histórico de pagamentos</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {payments.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          {payment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {payment.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          R$ {payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'pago' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'pendente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status === 'pago' 
                              ? 'Pago' 
                              : payment.status === 'pendente'
                                ? 'Pendente'
                                : 'Cancelado'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>Você ainda não possui histórico de pagamentos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ManageSubscription; 