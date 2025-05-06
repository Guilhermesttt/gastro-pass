import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

export function AdminReports() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    // Simular carregamento de dados
    setTotalRevenue(9999.90);
    setTotalUsers(150);
    setTotalRestaurants(25);
    
    setRecentPayments([
      {
        id: '1',
        userName: 'João Silva',
        amount: 99.90,
        date: '2024-03-20T10:00:00',
        status: 'pago'
      },
      {
        id: '2',
        userName: 'Maria Santos',
        amount: 99.90,
        date: '2024-03-19T15:30:00',
        status: 'pago'
      }
    ]);
    
    setRecentUsers([
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        date: '2024-03-20T10:00:00'
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        date: '2024-03-19T15:30:00'
      }
    ]);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-4 lg:p-8 w-full lg:ml-64">
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold mb-2">Relatórios</h1>
          <p className="text-text">Visualize os principais indicadores do sistema.</p>
        </div>
        
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 lg:p-6">
            <h3 className="text-sm font-medium text-text-light mb-1">Receita Total</h3>
            <p className="text-2xl lg:text-3xl font-bold text-primary">
              {formatCurrency(totalRevenue)}
            </p>
          </Card>
          
          <Card className="p-4 lg:p-6">
            <h3 className="text-sm font-medium text-text-light mb-1">Total de Usuários</h3>
            <p className="text-2xl lg:text-3xl font-bold text-primary">
              {totalUsers}
            </p>
          </Card>
          
          <Card className="p-4 lg:p-6">
            <h3 className="text-sm font-medium text-text-light mb-1">Total de Restaurantes</h3>
            <p className="text-2xl lg:text-3xl font-bold text-primary">
              {totalRestaurants}
            </p>
          </Card>
        </div>
        
        {/* Tabelas de Dados Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pagamentos Recentes */}
          <Card className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pagamentos Recentes</h2>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-text-light">Usuário</th>
                    <th className="text-left py-2 text-sm font-medium text-text-light">Valor</th>
                    <th className="text-left py-2 text-sm font-medium text-text-light">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="py-2 text-sm">{payment.userName}</td>
                      <td className="py-2 text-sm">{formatCurrency(payment.amount)}</td>
                      <td className="py-2 text-sm">{formatDate(payment.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Usuários Recentes */}
          <Card className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Usuários Recentes</h2>
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-text-light">Nome</th>
                    <th className="text-left py-2 text-sm font-medium text-text-light">Email</th>
                    <th className="text-left py-2 text-sm font-medium text-text-light">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-2 text-sm">{user.name}</td>
                      <td className="py-2 text-sm">{user.email}</td>
                      <td className="py-2 text-sm">{formatDate(user.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 