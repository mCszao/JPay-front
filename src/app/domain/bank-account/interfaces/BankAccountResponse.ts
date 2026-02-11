import {TransactionResponse} from '../../transaction/interfaces/TransactionResponse';

export interface BankAccountResponse {
  id: number;
  name: string;
  bank: string;
  currentBalance: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  transactions?: TransactionResponse[]
}
