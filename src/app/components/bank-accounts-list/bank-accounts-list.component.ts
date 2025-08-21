import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface BankAccountRow {
  id: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  active: boolean;
}

@Component({
  selector: 'app-bank-accounts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-accounts-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class BankAccountsListComponent {
  @Input() items: BankAccountRow[] = [];
  @Output() edit = new EventEmitter<BankAccountRow>();
  @Output() toggle = new EventEmitter<BankAccountRow>();
  @Output() remove = new EventEmitter<BankAccountRow>();
}
