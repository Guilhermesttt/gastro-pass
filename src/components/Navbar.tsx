import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
      document.body.style.overflow = '';
      return;
    }

    if (path.startsWith('/') && path.includes('#')) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate(path);
        setIsOpen(false);
        document.body.style.overflow = '';
        return;
      }
      const targetId = path.substring(path.indexOf('#'));
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarElement = document.querySelector('nav');
        const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setIsOpen(false);
        document.body.style.overflow = '';
      } else {
        console.warn(`Element with id ${targetId} not found for smooth scroll.`);
      }
      return;
    }
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Benefícios', path: '/#benefits' },
    { name: 'Como Funciona', path: '/#how-it-works' },
    { name: 'Restaurantes', path: '/#restaurants' },
    { name: 'Contato', path: '/#contact' },
  ];

  useEffect(() => {
    // Verificar se o usuário está logado e se é admin
    const checkUserAuth = () => {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          setIsLoggedIn(true);
          setIsAdmin(user.isAdmin === true);
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkUserAuth();
  }, [location.pathname]);

  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <nav className="bg-card/90 backdrop-blur-md shadow-custom fixed w-full z-50 border-b border-border/30">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/img/gastro pass branco.png" 
              alt="Gastro Pass Logo" 
              className="h-40 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => handleSmoothScroll(e, item.path)}
                  className="text-foreground hover:text-primary font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center text-primary hover:text-primary-dark transition-colors duration-200 font-medium"
                  >
                    <User size={20} className="mr-1" />
                    <span>Minha Conta</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="btn btn-secondary"
                    >
                      Admin
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                  >
                    Cadastre-se
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-custom text-foreground hover:text-primary focus:outline-none"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 left-0 right-0 bottom-0 bg-card/95 backdrop-blur-md z-30 border-t border-border/30 overflow-y-auto h-[calc(100vh-4rem)]"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex flex-col space-y-6 mb-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={(e) => handleSmoothScroll(e, item.path)}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors block py-2"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col space-y-4 mt-auto pb-6">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="btn btn-primary w-full flex justify-center items-center"
                      onClick={(e) => handleSmoothScroll(e, '/dashboard')}
                    >
                      <User size={20} className="mr-2" />
                      Minha Conta
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="btn btn-secondary w-full flex justify-center items-center"
                        onClick={(e) => handleSmoothScroll(e, '/admin')}
                      >
                        Admin
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn btn-outline w-full text-center"
                      onClick={(e) => handleSmoothScroll(e, '/login')}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-primary w-full text-center"
                      onClick={(e) => handleSmoothScroll(e, '/register')}
                    >
                      Cadastre-se
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
