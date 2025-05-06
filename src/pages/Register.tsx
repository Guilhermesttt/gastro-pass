import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RegisterForm from '@/components/RegisterForm';
import Footer from '@/components/Footer';

const Register = () => {
  const navigate = useNavigate();

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
      
      <main className="flex-grow flex items-center justify-center pt-28 pb-20 bg-gray-50">
        <div className="container max-w-lg mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden my-8">
            <RegisterForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
