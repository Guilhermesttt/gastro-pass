import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Check, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Carregar planos do localStorage ou usar planos padrão
    const storedPlans = localStorage.getItem('plans');
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      const defaultPlans = [
        {
          id: 'basic',
          name: 'Básico',
          price: 19.90,
          description: 'Ideal para usuários individuais',
          features: [
            'Acesso a 20 restaurantes',
            'Descontos básicos',
            'Suporte por email'
          ]
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 39.90,
          description: 'Para usuários que desejam mais benefícios',
          features: [
            'Acesso a todos os restaurantes',
            'Descontos premium (até 30%)',
            'Suporte prioritário',
            'Cupons exclusivos mensais'
          ]
        },
        {
          id: 'family',
          name: 'Família',
          price: 59.90,
          description: 'Perfeito para toda a família',
          features: [
            'Acesso a todos os restaurantes',
            'Descontos premium (até 30%)',
            'Até 4 usuários',
            'Suporte prioritário 24/7',
            'Cupons exclusivos semanais'
          ]
        }
      ];
      setPlans(defaultPlans);
      localStorage.setItem('plans', JSON.stringify(defaultPlans));
    }
  }, []);

  const handlePlanSelection = (plan: Plan) => {
    // Mensagem personalizada para o WhatsApp
    const message = `Olá! Gostaria de assinar o plano ${plan.name} do Gastro Pass.\n\n` +
      `Plano: ${plan.name}\n` +
      `Valor: R$ ${plan.price.toFixed(2)}/mês\n\n` +
      `Benefícios:\n${plan.features.map(feature => `- ${feature}`).join('\n')}`;
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Número do WhatsApp
    const whatsappNumber = '5567998354747';
    
    // Cria o link do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abre o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'Redirecionando para o WhatsApp',
      description: 'Você será redirecionado para iniciar sua assinatura.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-60 pb-20">
        <div className="container-custom">
          {/* Botão Voltar */}
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-primary hover:text-primary-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para Restaurantes
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
            <p className="text-lg text-foreground-light max-w-2xl mx-auto">
              Selecione o plano ideal para você e continue aproveitando os melhores benefícios em restaurantes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="card hover:scale-105 transition-transform duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-foreground-light mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-primary">
                    R$ {plan.price.toFixed(2)}
                    <span className="text-sm font-normal text-foreground-light">/mês</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan)}
                  className="btn btn-primary w-full"
                >
                  Selecionar Plano
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Plans; 