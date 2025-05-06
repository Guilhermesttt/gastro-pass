
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user') !== null;
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Benefícios', path: '/#benefits' },
    { name: 'Como Funciona', path: '/#how-it-works' },
    { name: 'Restaurantes', path: '/#restaurants' },
    { name: 'Contato', path: '/#contact' },
  ];

  return (
    <nav className="bg-card shadow-sm fixed w-full z-50 border-b border-border/20">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-primary font-bold text-2xl">RestoBenefícios</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-foreground hover:text-primary transition-colors duration-200"
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
                    className="flex items-center text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    <User size={20} className="mr-1" />
                    <span>Minha Conta</span>
                  </Link>
                  <Link
                    to="/admin"
                    className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-all duration-200"
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-foreground hover:text-primary transition-colors duration-200">
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-all duration-200"
                  >
                    Cadastre-se
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden fixed inset-0 bg-card z-40 pt-16 transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex flex-col space-y-6 mb-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-lg font-medium text-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col space-y-4 mt-auto">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="btn btn-primary w-full flex justify-center items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} className="mr-2" />
                    Minha Conta
                  </Link>
                  <Link
                    to="/admin"
                    className="btn bg-secondary text-foreground w-full flex justify-center items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-outline w-full text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary w-full text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Cadastre-se
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
