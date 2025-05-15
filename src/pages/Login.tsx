
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/LoginForm';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useIsMobile } from '@/hooks/use-mobile';

const Login = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.isAdmin) {
          // Admin users should only go to admin panel
          navigate('/admin');
        } else {
          // Regular users go to dashboard
          navigate('/dashboard');
        }
        return;
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }

    // Simulate page loading
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <LoadingScreen text="Preparando tela de login..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className={`flex-grow flex items-center justify-center ${isMobile ? 'pt-36' : 'pt-60'} pb-20 bg-gray-50`}>
        <div className="container max-w-md mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden my-4 sm:my-8">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
