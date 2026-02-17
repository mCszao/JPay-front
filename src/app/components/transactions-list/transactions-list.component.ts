import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TransactionResponse} from '../../domain/transaction/interfaces/TransactionResponse';


@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['../list.shared.scss'],
})
export class TransactionListComponent {
  @Input() items: TransactionResponse[] = [];
  @Output() edit = new EventEmitter<TransactionResponse>();
  @Output() toggleStatus = new EventEmitter<TransactionResponse>();
  @Output() remove = new EventEmitter<TransactionResponse>();
}
