
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 lg:min-h-[80vh] flex items-center bg-gradient-to-br from-blue-50 to-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text-dark">
              Descubra os melhores{" "}
              <span className="text-primary">benefícios</span> em restaurantes
            </h1>
            <p className="text-lg md:text-xl mb-8 text-text-dark max-w-lg">
              Acesso exclusivo a descontos, experiências gastronômicas e 
              vantagens especiais nos melhores restaurantes da cidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn btn-primary text-center">
                Começar Agora
              </Link>
              <Link to="/#how-it-works" className="btn btn-outline text-center">
                Saiba Mais
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Restaurante com pratos deliciosos"
                className="rounded-lg shadow-xl w-full h-auto object-cover z-10 relative"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
