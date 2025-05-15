
export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  location?: string;
}

export interface Payment {
  id: string;
  userName: string;
  amount: number;
  date: string;
  status: 'pendente' | 'pago' | 'cancelado';
}

export interface UserAuth {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  user: User | null;
}
