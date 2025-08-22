import { AccountPayableStatus } from "../types/AccountPayableStatus";

export interface AccountPayable {
  id: number;
  title: string;
  description?: string;
  category: string;
  expirationDate: string;
  amount: number;
  status: AccountPayableStatus;
  createdAt?: string;
  updatedAt?: string;
}
