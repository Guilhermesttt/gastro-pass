
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BenefitCard from '@/components/BenefitCard';
import Timeline from '@/components/Timeline';
import Footer from '@/components/Footer';
import { utensils, discount, gift, star } from 'lucide-react';

const Index = () => {
  // Scroll to section if hash is present in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const benefits = [
    {
      icon: <discount className="w-8 h-8" />,
      title: 'Descontos Exclusivos',
      description: 'Economize até 25% em restaurantes selecionados com nossos descontos exclusivos para membros.'
    },
    {
      icon: <gift className="w-8 h-8" />,
      title: 'Benefícios Especiais',
      description: 'Acesso a menus degustação, bebidas cortesia e sobremesas gratuitas nos melhores estabelecimentos.'
    },
    {
      icon: <star className="w-8 h-8" />,
      title: 'Experiências Premium',
      description: 'Participe de eventos gastronômicos exclusivos e conheça chefs renomados em experiências únicas.'
    }
  ];

  const restaurantPartners = [
    {
      id: '1',
      name: 'La Tratoria',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      category: 'Italiana • $$',
      location: 'Centro',
      rating: 4.8,
      discount: '15% OFF'
    },
    {
      id: '2',
      name: 'Sushi Kenzo',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      category: 'Japonesa • $$$',
      location: 'Jardins',
      rating: 4.9,
      discount: '10% OFF'
    },
    {
      id: '3',
      name: 'Burger House',
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1071&q=80',
      category: 'Hamburgeria • $$',
      location: 'Pinheiros',
      rating: 4.6,
      discount: '20% OFF'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Benefits Section */}
      <section id="benefits" className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2>Benefícios Exclusivos</h2>
            <p className="max-w-2xl mx-auto text-lg">
              Nossos membros têm acesso a vantagens especiais em restaurantes selecionados.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section id="how-it-works" className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2>Como Funciona</h2>
            <p className="max-w-2xl mx-auto text-lg">
              Começar a aproveitar os benefícios é simples e rápido.
            </p>
          </div>
          
          <Timeline />
        </div>
      </section>
      
      {/* Restaurant Partners Section */}
      <section id="restaurants" className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2>Restaurantes Parceiros</h2>
            <p className="max-w-2xl mx-auto text-lg">
              Conheça alguns dos restaurantes parceiros que oferecem benefícios exclusivos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {restaurantPartners.map((restaurant) => (
              <div key={restaurant.id} className="card group cursor-pointer overflow-hidden">
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <div className="absolute top-0 right-0 bg-secondary text-black font-medium px-3 py-1 z-10 rounded-bl-lg">
                    {restaurant.discount}
                  </div>
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                      <star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-text">
                    <p className="mb-1">{restaurant.category}</p>
                    <p>{restaurant.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a href="/register" className="btn btn-primary">
              Ver Todos os Restaurantes
            </a>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-white mb-4">Pronto para começar?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão economizando e aproveitando experiências gastronômicas exclusivas.
            </p>
            <a href="/register" className="btn bg-white text-primary hover:bg-gray-100">
              Criar Conta Gratuita
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
