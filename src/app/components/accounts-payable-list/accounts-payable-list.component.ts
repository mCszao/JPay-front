import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountPayableResponse } from '../../interfaces/AccountPayableResponse';

@Component({
  selector: 'app-accounts-payable-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts-payable-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class AccountsPayableListComponent {
  @Input() items: AccountPayableResponse[] = [];
  @Output() edit = new EventEmitter<AccountPayableResponse>();
  @Output() toggleStatus = new EventEmitter<AccountPayableResponse>();
  @Output() remove = new EventEmitter<AccountPayableResponse>();
}
