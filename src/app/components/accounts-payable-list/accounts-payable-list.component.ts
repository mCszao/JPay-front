import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountPayableResponse } from '../../interfaces/AccountPayableResponse';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-accounts-payable-list',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './accounts-payable-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class AccountsPayableListComponent {
  @Input() items: AccountPayableResponse[] = [];
  @Output() edit = new EventEmitter<AccountPayableResponse>();
  @Output() toggleStatus = new EventEmitter<AccountPayableResponse>();
  @Output() remove = new EventEmitter<AccountPayableResponse>();
}
