import { cn } from "@/lib/utils";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
}

const Timeline = () => {
  const steps: TimelineStep[] = [
    {
      id: 1,
      title: "Cadastre-se na plataforma",
      description: "Crie sua conta gratuitamente em menos de 2 minutos."
    },
    {
      id: 2,
      title: "Escolha seu plano",
      description: "Selecione entre nossos planos personalizados para suas necessidades."
    },
    {
      id: 3,
      title: "Descubra restaurantes",
      description: "Explore nossa rede de restaurantes parceiros e seus benefícios."
    },
    {
      id: 4,
      title: "Desfrute dos benefícios",
      description: "Apresente seu cartão virtual e aproveite descontos e vantagens."
    }
  ];

  return (
    <div className="py-12">
      <div className="relative">
        {/* Timeline line */}
        <div className="hidden md:block absolute left-0 right-0 h-2 bg-secondary/30 top-24"></div>
        
        {/* Timeline points */}
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className={cn(
              "relative flex flex-col items-center text-center",
              "transition-all duration-300 hover:transform hover:scale-105"
            )}>
              {/* Number circle */}
              <div className={cn(
                "w-14 h-14 rounded-custom flex items-center justify-center text-white font-bold mb-4 md:mb-8 z-10",
                "bg-primary shadow-custom-lg border-2 border-primary-dark"
              )}>
                {step.id}
              </div>
              
              {/* Content */}
              <div className="card w-full">
                <h4 className="text-lg font-semibold mb-2 text-primary-dark">{step.title}</h4>
                <p className="text-sm text-foreground-light">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
