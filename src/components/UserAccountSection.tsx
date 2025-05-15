
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, CreditCard, Calendar, Lock, Mail, Check } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  subscription?: {
    planId: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

const UserAccountSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Erro ao analisar dados do usuário:', error);
        return null;
      }
    }
    return null;
  });
  
  const [planName, setPlanName] = useState<string>('Nenhum');
  
  useEffect(() => {
    // Se o usuário tem uma assinatura ativa, buscar o nome do plano
    if (userData?.subscription?.planId && userData.subscription.status === 'ativo') {
      const plans = JSON.parse(localStorage.getItem('plans') || '[]');
      const plan = plans.find((p: any) => p.id === userData.subscription?.planId);
      if (plan) {
        setPlanName(plan.name);
      }
    }
  }, [userData]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  // Verificar se há mudanças no localStorage (para identificar aprovações de pagamento)
  useEffect(() => {
    const checkUserChanges = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (JSON.stringify(parsedUser) !== JSON.stringify(userData)) {
            setUserData(parsedUser);
          }
        } catch (error) {
          console.error('Erro ao analisar dados do usuário:', error);
        }
      }
    };
    
    // Verificar a cada 5 segundos
    const interval = setInterval(checkUserChanges, 5000);
    
    return () => clearInterval(interval);
  }, [userData]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: 'Você saiu',
      description: 'Sua sessão foi encerrada com sucesso.',
    });
    navigate('/login');
  };

  if (!userData) {
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-border">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userData.name}</h2>
            <p className="text-foreground-light">{userData.email}</p>
            
            {userData.subscription && userData.subscription.status === 'ativo' ? (
              <span className="inline-flex items-center text-sm mt-2 bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                <Check className="w-3 h-3 mr-1" />
                Plano {planName} ativo
              </span>
            ) : null}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-red-500 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sair da conta</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-3">Dados da conta</h3>
          
          <div className="space-y-2">
            <div className="flex items-center text-foreground-light">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm">Nome completo</span>
            </div>
            <p className="font-medium">{userData.name}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-foreground-light">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm">Email</span>
            </div>
            <p className="font-medium">{userData.email}</p>
          </div>
          
          {userData.createdAt && (
            <div className="space-y-2">
              <div className="flex items-center text-foreground-light">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Membro desde</span>
              </div>
              <p className="font-medium">{formatDate(userData.createdAt)}</p>
            </div>
          )}
          
          {userData.subscription && userData.subscription.status === 'ativo' && (
            <div className="space-y-2">
              <div className="flex items-center text-foreground-light">
                <CreditCard className="w-4 h-4 mr-2" />
                <span className="text-sm">Assinatura</span>
              </div>
              <p className="font-medium">
                Plano {planName} · Válido até {formatDate(userData.subscription.endDate)}
              </p>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Ações rápidas</h3>
          <div className="space-y-3">
            <Link to="/change-password" className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-background transition-colors">
              <div className="flex items-center">
                <Lock className="w-5 h-5 mr-3 text-primary" />
                <span>Alterar senha</span>
              </div>
              <span className="text-foreground-light">→</span>
            </Link>
            
            <Link to="/manage-subscription" className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-background transition-colors">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-3 text-primary" />
                <span>Gerenciar assinatura</span>
              </div>
              <span className="text-foreground-light">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountSection;
