import { AccountPayableStatus } from "../types/AccountPayableStatus";

export interface AccountPayableFormData {
  title: string;
  description: string;
  category: string;
  expirationDate: string;
  amount: number;
  status: AccountPayableStatus;
}
