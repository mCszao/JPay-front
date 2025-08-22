import { AccountPayableStatus } from "../types/AccountPayableStatus";
import { TransactionType } from "../types/TransactionType";

export interface AccountPayable {
  id: number;
  description: string;
  category: string;
  bankAccount: string;
  expirationDate: string;
  amount: number;
  type: TransactionType;
  status: AccountPayableStatus;
  createdAt?: string;
  updatedAt?: string;
}
