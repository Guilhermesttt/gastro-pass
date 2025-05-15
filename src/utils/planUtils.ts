
export interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export const getDefaultPlans = (): Plan[] => [
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

export const getPlanById = (planId: string): Plan | undefined => {
  const plans = getDefaultPlans();
  return plans.find(plan => plan.id === planId);
};

export const getUserPlanDetails = (userData: any): {
  planName: string;
  planDetails: Plan | null;
  isActive: boolean;
} => {
  if (!userData?.subscription || userData.subscription.status !== 'ativo') {
    return { planName: 'Nenhum', planDetails: null, isActive: false };
  }
  
  const planDetails = getPlanById(userData.subscription.planId);
  
  return {
    planName: planDetails?.name || 'Desconhecido',
    planDetails: planDetails || null,
    isActive: true
  };
};
