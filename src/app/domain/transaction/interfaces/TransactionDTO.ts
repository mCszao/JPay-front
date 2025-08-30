import { TransactionStatus } from "../../types/TransactionStatus"
import { TransactionType } from "../../types/TransactionType"

export interface TransactionDTO {
  description: string,
  amount: number,
  expirationDate: string,
  categoryId: number,
  bankAccountId: number,
  status: TransactionStatus
  type: TransactionType
}
