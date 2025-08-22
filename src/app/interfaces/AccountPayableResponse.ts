export interface AccountPayableResponse {
  id: number;
  description: string;
  amount: number;
  expirationDate: string;
  paymentDate: string | null;
  type: 'ATIVO' | 'PASSIVO' | string;
  status: 'PENDING' | 'PAID';
  isExpired: boolean;
  category: {
    id: number;
    name: string;
  };
  bankAccount: {
    id: number;
    name: string;
    bank: string;
  };
  createdAt: string;
  updatedAt: string;
}
