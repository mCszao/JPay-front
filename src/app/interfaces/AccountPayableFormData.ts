import { AccountPayableStatus } from "../types/AccountPayableStatus";
import { TransactionType } from "../types/TransactionType";

export interface AccountPayableFormData {
  categoryId?: number;
  bankId: number;
  description: string;
  category: string;
  type: TransactionType;
  expirationDate: string;
  amount: number;
  status: AccountPayableStatus;
}
