import { ReactNode } from 'react';

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="card hover:translate-y-[-5px] transition-all duration-300">
      <div className="rounded-custom bg-primary/10 w-16 h-16 flex items-center justify-center mb-6 text-primary border-2 border-primary/30 shadow-custom">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-primary-dark">{title}</h3>
      <p className="text-foreground-light">{description}</p>
    </div>
  );
};

export default BenefitCard;
