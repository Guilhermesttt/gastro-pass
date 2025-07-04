
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RegisterForm from '@/components/RegisterForm';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

const Register = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className={`flex-grow flex items-center justify-center ${isMobile ? 'pt-20' : 'pt-20'} pb-12 sm:pb-20 bg-gray-50`}>
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden my-4 sm:my-8">
            <RegisterForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
