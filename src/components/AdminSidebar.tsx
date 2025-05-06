import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Utensils, 
  Users, 
  BarChart, 
  ChevronLeft,
  LogOut,
  CreditCard,
  Package,
  Menu,
  X
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ icon, label, to, isActive, isCollapsed }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-3 rounded-md transition-colors",
      isActive 
        ? "bg-primary text-white" 
        : "text-gray-700 hover:bg-gray-100"
    )}
  >
    {icon}
    {!isCollapsed && <span>{label}</span>}
  </Link>
);

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const activePath = location.pathname;

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fechar menu mobile ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      to: '/admin'
    },
    {
      icon: <Utensils size={20} />,
      label: 'Restaurantes',
      to: '/admin/restaurants'
    },
    {
      icon: <Users size={20} />,
      label: 'Usuários',
      to: '/admin/users'
    },
    {
      icon: <CreditCard size={20} />,
      label: 'Pagamentos',
      to: '/admin/payments'
    },
    {
      icon: <Package size={20} />,
      label: 'Planos',
      to: '/admin/plans'
    },
    {
      icon: <BarChart size={20} />,
      label: 'Relatórios',
      to: '/admin/reports'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={cn(
          "bg-white shadow-md h-screen transition-all duration-300 fixed lg:relative z-40",
          isCollapsed ? "w-16" : "w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center p-4 border-b">
          {!isCollapsed && (
            <h1 className="font-bold text-xl text-primary">Admin</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "rounded-full p-2 hover:bg-gray-100 transition-colors hidden lg:block",
              isCollapsed ? "ml-auto" : "ml-auto"
            )}
          >
            <ChevronLeft 
              size={20} 
              className={cn(
                "transition-transform",
                isCollapsed ? "rotate-180" : ""
              )} 
            />
          </button>
        </div>
        
        <div className="py-6 px-3 flex flex-col h-[calc(100%-64px)] justify-between">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={activePath === item.to}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
          
          <div>
            <Link
              to="/login"
              onClick={() => localStorage.removeItem('user')}
              className={cn(
                "flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              )}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Sair</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
