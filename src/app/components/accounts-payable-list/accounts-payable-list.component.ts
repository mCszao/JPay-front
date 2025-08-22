import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountPayableStatus } from '../../types/AccountPayableStatus';
import { AccountPayable } from '../../interfaces/AccountPayable';

@Component({
  selector: 'app-accounts-payable-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts-payable-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class AccountsPayableListComponent {
  @Input() items: AccountPayable[] = [];
  @Output() edit = new EventEmitter<AccountPayable>();
  @Output() toggleStatus = new EventEmitter<AccountPayable>();
  @Output() remove = new EventEmitter<AccountPayable>();
}
