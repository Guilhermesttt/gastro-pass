
import { ReactNode } from 'react';

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="card hover:translate-y-[-5px] transition-all duration-300">
      <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-6 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-text-dark">{title}</h3>
      <p className="text-text">{description}</p>
    </div>
  );
};

export default BenefitCard;
