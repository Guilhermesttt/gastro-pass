
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ComponentLoader } from '@/components/ui/component-loader';
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
import { Check, XCircle, ExternalLink, FileCheck, X } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { Payment } from '@/types';

export function AdminPayments() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'pago' | 'cancelado'>('todos');
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in as admin
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
      
      // Simulate loading delay for payments data
      setTimeout(() => {
        // Carregar pagamentos do localStorage
        const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
        setPayments(allPayments);
        updateFilteredPayments(allPayments, statusFilter);
        setIsLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/admin-login');
      return;
    }
  }, [navigate]);

  const updateFilteredPayments = (payments: Payment[], status: 'todos' | 'pendente' | 'pago' | 'cancelado') => {
    if (status === 'todos') {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(payment => payment.status === status));
    }
  };

  const handleStatusFilterChange = (status: 'todos' | 'pendente' | 'pago' | 'cancelado') => {
    setStatusFilter(status);
    updateFilteredPayments(payments, status);
  };

  const handleApprovePayment = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsApproveDialogOpen(true);
  };

  const handleRejectPayment = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmApprove = () => {
    if (currentPayment) {
      setIsActionLoading(true);
      
      // Simulate processing delay
      setTimeout(() => {
        // 1. Atualizar o status do pagamento para 'pago'
        let updatedPayments = payments.map(payment => 
          payment.id === currentPayment.id 
            ? { ...payment, status: 'pago' as const }
            : payment
        );
        setPayments(updatedPayments);
        localStorage.setItem('payments', JSON.stringify(updatedPayments));
        updateFilteredPayments(updatedPayments, statusFilter);
        
        // 2. Atualizar a assinatura do usuário
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.id === currentPayment.userId);
        
        if (user) {
          // Encontrar os detalhes do plano
          const plans = JSON.parse(localStorage.getItem('plans') || '[]');
          const plan = plans.find((p: any) => p.id === currentPayment.planId);
          
          if (plan) {
            // Criar data de início (hoje) e data de fim (1 mês a partir de hoje)
            const startDate = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            
            // Atualizar usuário com assinatura ativa
            const updatedUser = {
              ...user,
              subscription: {
                planId: plan.id,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status: 'ativo'
              },
              paymentPending: null
            };
            
            // Atualizar o usuário na lista
            const updatedUsers = users.map((u: any) => 
              u.id === updatedUser.id ? updatedUser : u
            );
            
            // Salvar no localStorage
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Se o usuário estiver logado e for este usuário, atualizar também seu objeto no localStorage
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
              const currentUser = JSON.parse(currentUserStr);
              if (currentUser.id === updatedUser.id) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
              }
            }
          }
        }
        
        setIsApproveDialogOpen(false);
        setIsActionLoading(false);
        
        toast({
          title: 'Pagamento aprovado',
          description: `O pagamento de ${currentPayment.userName} foi aprovado com sucesso.`
        });
      }, 800);
    }
  };

  const handleConfirmReject = () => {
    if (currentPayment) {
      setIsActionLoading(true);
      
      // Simulate processing delay
      setTimeout(() => {
        // 1. Atualizar o status do pagamento para 'cancelado'
        let updatedPayments = payments.map(payment => 
          payment.id === currentPayment.id 
            ? { ...payment, status: 'cancelado' as const }
            : payment
        );
        setPayments(updatedPayments);
        localStorage.setItem('payments', JSON.stringify(updatedPayments));
        updateFilteredPayments(updatedPayments, statusFilter);
        
        // 2. Remover o pagamento pendente do usuário
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.id === currentPayment.userId);
        
        if (user && user.paymentPending && user.paymentPending.paymentId === currentPayment.id) {
          const updatedUser = {
            ...user,
            paymentPending: null
          };
          
          // Atualizar o usuário na lista
          const updatedUsers = users.map((u: any) => 
            u.id === updatedUser.id ? updatedUser : u
          );
          
          // Salvar no localStorage
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          
          // Se o usuário estiver logado e for este usuário, atualizar também seu objeto no localStorage
          const currentUserStr = localStorage.getItem('user');
          if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.id === updatedUser.id) {
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          }
        }
        
        setIsRejectDialogOpen(false);
        setIsActionLoading(false);
        
        toast({
          title: 'Pagamento rejeitado',
          description: `O pagamento de ${currentPayment.userName} foi rejeitado.`
        });
      }, 800);
    }
  };

  const handleClearPayments = () => {
    setIsClearDialogOpen(true);
  };

  const handleConfirmClear = () => {
    setIsActionLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setPayments([]);
      setFilteredPayments([]);
      setIsClearDialogOpen(false);
      setIsActionLoading(false);
      
      toast({
        title: 'Lista limpa',
        description: 'A lista de pagamentos foi limpa com sucesso.'
      });
    }, 600);
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  // Show loading screen while checking auth and loading initial data
  if (!isAdmin || isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8 w-full lg:ml-64 flex items-center justify-center">
          <LoadingScreen text="Carregando dados de pagamentos..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 lg:p-8 w-full lg:ml-64">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold mb-2">Gerenciar Pagamentos</h1>
            <p className="text-text">Aprove ou rejeite solicitações de pagamento dos usuários.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
            <Button 
              variant={statusFilter === 'todos' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('todos')}
              className="flex-1 lg:flex-none"
            >
              Todos
            </Button>
            <Button 
              variant={statusFilter === 'pendente' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('pendente')}
              className="flex-1 lg:flex-none"
            >
              Pendentes
            </Button>
            <Button 
              variant={statusFilter === 'pago' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('pago')}
              className="flex-1 lg:flex-none"
            >
              Aprovados
            </Button>
            <Button 
              variant={statusFilter === 'cancelado' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('cancelado')}
              className="flex-1 lg:flex-none"
            >
              Rejeitados
            </Button>
            <Button
              variant="outline"
              onClick={handleClearPayments}
              className="flex-1 lg:flex-none text-red-600 border-red-600 hover:bg-red-50"
            >
              Limpar clientes
            </Button>
          </div>
        </div>
        
        {/* Tabela de Pagamentos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text-dark">{payment.id}</td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.userName}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        R$ {payment.amount.toFixed(2)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'pago' 
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.status === 'pago' 
                            ? 'Aprovado'
                            : payment.status === 'pendente'
                            ? 'Pendente'
                            : 'Rejeitado'
                          }
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-text">
                        <div className="flex gap-2">
                          {payment.status === 'pendente' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprovePayment(payment)}
                                className="flex items-center gap-1"
                              >
                                <Check size={14} />
                                <span className="hidden sm:inline">Aprovar</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectPayment(payment)}
                                className="flex items-center gap-1"
                              >
                                <X size={14} />
                                <span className="hidden sm:inline">Rejeitar</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 lg:px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum pagamento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Aprovação */}
      {isApproveDialogOpen && currentPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirmar Aprovação</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja aprovar o pagamento de {currentPayment.userName} no valor de R$ {currentPayment.amount.toFixed(2)}?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                  disabled={isActionLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmApprove}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size={16} />
                      <span className="ml-2">Processando...</span>
                    </span>
                  ) : (
                    'Aprovar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Rejeição */}
      {isRejectDialogOpen && currentPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirmar Rejeição</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja rejeitar o pagamento de {currentPayment.userName} no valor de R$ {currentPayment.amount.toFixed(2)}?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRejectDialogOpen(false)}
                  disabled={isActionLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmReject}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size={16} />
                      <span className="ml-2">Processando...</span>
                    </span>
                  ) : (
                    'Rejeitar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Limpar Clientes */}
      {isClearDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Confirmar Limpar Lista</h2>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja limpar toda a lista de pagamentos exibida?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsClearDialogOpen(false)}
                  disabled={isActionLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmClear}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size={16} />
                      <span className="ml-2">Processando...</span>
                    </span>
                  ) : (
                    'Limpar'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;
