import { TransactionStatus } from "../domain/types/TransactionStatus";
import { TransactionType } from "../domain/types/TransactionType";

export interface Transaction {
  id: number;
  description: string;
  category: string;
  bankAccount: string;
  expirationDate: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt?: string;
  updatedAt?: string;
}
