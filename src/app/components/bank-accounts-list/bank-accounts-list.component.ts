import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BankAccount } from '../../interfaces/BankAccount';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-bank-accounts-list',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './bank-accounts-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class BankAccountsListComponent {
  @Input() items: BankAccount[] = [];
  @Output() edit = new EventEmitter<BankAccount>();
  @Output() toggle = new EventEmitter<BankAccount>();
  @Output() remove = new EventEmitter<BankAccount>();
}
