import { TransactionStatus } from "../../types/TransactionStatus";
import { TransactionType } from "../../types/TransactionType";


export interface TransactionFormData {
  categoryId?: number;
  bankId: number;
  description: string;
  category: string;
  type: TransactionType;
  expirationDate: string;
  amount: number;
  status: TransactionStatus;
}
