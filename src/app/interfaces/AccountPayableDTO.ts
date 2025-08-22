import { AccountPayableStatus } from "../types/AccountPayableStatus";
import { TransactionType } from "../types/TransactionType";

export interface AccountPayableDTO {
  description: string,
  amount: number,
  expirationDate: string,
  categoryId: number,
  bankAccountId: number,
  status: AccountPayableStatus
  type: TransactionType
}
