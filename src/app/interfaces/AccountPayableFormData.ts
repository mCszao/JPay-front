import { AccountPayableStatus } from "../types/AccountPayableStatus";

export interface AccountPayableFormData {
  title: string;
  description: string;
  category: string;
  dueDate: string;
  amount: number;
  status: AccountPayableStatus;
}
