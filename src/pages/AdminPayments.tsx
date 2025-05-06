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
import { Check, XCircle, ExternalLink, FileCheck } from 'lucide-react';

interface Payment {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  date: string;
  description: string;
  amount: number;
  status: 'pendente' | 'pago' | 'cancelado';
  planId: string;
  planName?: string;
}

const AdminPayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('todos');

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
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigate('/admin-login');
      return;
    }
    
    // Load payments from localStorage
    loadPayments();
  }, [navigate]);

  const loadPayments = () => {
    const storedPayments = localStorage.getItem('payments');
    const storedUsers = localStorage.getItem('users');
    
    if (storedPayments && storedUsers) {
      try {
        const payments = JSON.parse(storedPayments);
        const users = JSON.parse(storedUsers);
        
        // Enrich payment data with user info
        const enrichedPayments = payments.map((payment: Payment) => {
          const user = users.find((u: any) => u.id === payment.userId);
          
          // Get plan name
          let planName = '';
          if (payment.planId === 'basic') planName = 'Básico';
          else if (payment.planId === 'premium') planName = 'Premium';
          else if (payment.planId === 'family') planName = 'Família';
          
          return {
            ...payment,
            userName: user ? user.name : 'Usuário desconhecido',
            userEmail: user ? user.email : '-',
            planName
          };
        });
        
        setPayments(enrichedPayments);
        updateFilteredPayments(enrichedPayments, statusFilter);
      } catch (error) {
        console.error('Erro ao carregar pagamentos:', error);
      }
    }
  };

  const updateFilteredPayments = (payments: Payment[], status: string) => {
    if (status === 'todos') {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(p => p.status === status));
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    updateFilteredPayments(payments, status);
  };

  const handleApproveClick = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsApproveDialogOpen(true);
  };

  const handleRejectClick = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!currentPayment) return;
    
    // Update payment status
    const updatedPayments = payments.map(payment => {
      if (payment.id === currentPayment.id) {
        return { ...payment, status: 'pago' };
      }
      return payment;
    });
    
    // Save to localStorage
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    
    // Update state
    setPayments(updatedPayments);
    updateFilteredPayments(updatedPayments, statusFilter);
    
    // Close dialog
    setIsApproveDialogOpen(false);
    
    toast({
      title: 'Pagamento aprovado',
      description: `O pagamento de ${currentPayment.userName} foi aprovado com sucesso.`,
    });
  };

  const handleConfirmReject = () => {
    if (!currentPayment) return;
    
    // Update payment status
    const updatedPayments = payments.map(payment => {
      if (payment.id === currentPayment.id) {
        return { ...payment, status: 'cancelado' };
      }
      return payment;
    });
    
    // Save to localStorage
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    
    // Update state
    setPayments(updatedPayments);
    updateFilteredPayments(updatedPayments, statusFilter);
    
    // Close dialog
    setIsRejectDialogOpen(false);
    
    toast({
      title: 'Pagamento rejeitado',
      description: `O pagamento de ${currentPayment.userName} foi rejeitado.`,
    });
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
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
            <h1 className="text-2xl font-bold mb-2">Gerenciar Pagamentos</h1>
            <p className="text-text">Aprove ou rejeite solicitações de pagamento dos usuários.</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === 'todos' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('todos')}
            >
              Todos
            </Button>
            <Button 
              variant={statusFilter === 'pendente' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('pendente')}
            >
              Pendentes
            </Button>
            <Button 
              variant={statusFilter === 'pago' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('pago')}
            >
              Aprovados
            </Button>
            <Button 
              variant={statusFilter === 'cancelado' ? 'default' : 'outline'}
              onClick={() => handleStatusFilterChange('cancelado')}
            >
              Rejeitados
            </Button>
          </div>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id.substring(0, 8)}...</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.userName}</TableCell>
                      <TableCell>{payment.userEmail}</TableCell>
                      <TableCell>{payment.planName}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                              : 'Rejeitado'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {payment.status === 'pendente' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveClick(payment)}
                                className="text-green-500 hover:text-green-700"
                              >
                                <Check size={16} className="mr-1" />
                                Aprovar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectClick(payment)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <XCircle size={16} className="mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                          {payment.status !== 'pendente' && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="opacity-50"
                            >
                              <FileCheck size={16} className="mr-1" />
                              Processado
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                      Nenhum pagamento {statusFilter !== 'todos' ? statusFilter : ''} encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Approve Dialog */}
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Aprovar pagamento</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja aprovar este pagamento?
              </DialogDescription>
            </DialogHeader>
            {currentPayment && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2 my-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Usuário:</span>
                  <span className="font-medium">{currentPayment.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plano:</span>
                  <span className="font-medium">{currentPayment.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor:</span>
                  <span className="font-medium">{formatCurrency(currentPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data:</span>
                  <span className="font-medium">{currentPayment.date}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleConfirmApprove} className="bg-green-600 hover:bg-green-700">
                <Check size={16} className="mr-2" />
                Confirmar aprovação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeitar pagamento</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja rejeitar este pagamento?
              </DialogDescription>
            </DialogHeader>
            {currentPayment && (
              <div className="bg-gray-50 p-4 rounded-md space-y-2 my-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Usuário:</span>
                  <span className="font-medium">{currentPayment.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Plano:</span>
                  <span className="font-medium">{currentPayment.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor:</span>
                  <span className="font-medium">{formatCurrency(currentPayment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data:</span>
                  <span className="font-medium">{currentPayment.date}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleConfirmReject}>
                <XCircle size={16} className="mr-2" />
                Confirmar rejeição
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPayments; 