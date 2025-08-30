import { TransactionStatus } from "../domain/types/TransactionStatus";
import { TransactionType } from "../domain/types/TransactionType";

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
