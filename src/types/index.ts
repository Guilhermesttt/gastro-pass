
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  location?: string;
  subscription?: {
    planId: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  paymentPending?: {
    paymentId: string;
    planId: string;
  };
}

export interface Payment {
  id: string;
  userName: string;
  amount: number;
  date: string;
  status: 'pendente' | 'pago' | 'cancelado';
  userId: string;
  planId: string;
}

export interface UserAuth {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  user: User | null;
}
