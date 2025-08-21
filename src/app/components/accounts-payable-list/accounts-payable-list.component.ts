import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountPayableStatus } from '../../types/AccountPayableStatus';


export interface AccountPayableRow {
  id: number;
  title: string;
  category: string;
  dueDate: string;
  amount: number;
  status: AccountPayableStatus;
}

@Component({
  selector: 'app-accounts-payable-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts-payable-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class AccountsPayableListComponent {
  @Input() items: AccountPayableRow[] = [];
  @Output() edit = new EventEmitter<AccountPayableRow>();
  @Output() toggleStatus = new EventEmitter<AccountPayableRow>();
  @Output() remove = new EventEmitter<AccountPayableRow>();
}
