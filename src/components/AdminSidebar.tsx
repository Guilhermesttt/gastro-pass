
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      "flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-300",
      isActive 
        ? "bg-primary text-white" 
        : "text-gray-700 hover:bg-gray-100 hover:text-primary"
    )}
  >
    {icon}
    <AnimatePresence>
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
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
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Sidebar */}
      <motion.div 
        animate={{
          width: isCollapsed ? 80 : 256,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className={cn(
          "bg-white shadow-md h-screen transition-all duration-300 fixed lg:relative z-40",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center p-4 border-b">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-xl text-primary"
              >
                Admin
              </motion.h1>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "rounded-full p-2 hover:bg-gray-100 transition-colors hidden lg:block",
              isCollapsed ? "ml-auto" : "ml-auto"
            )}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={20} />
            </motion.div>
          </motion.button>
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
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sair
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
