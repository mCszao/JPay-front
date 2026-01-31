import { Component, OnInit } from '@angular/core';
import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { SummaryCardsContainerComponent } from "../../components/summary-card/summary-cards-container/summary-cards-container.component";
import { SummaryCardComponent } from "../../components/summary-card/summary-card.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { DateService } from '../../core/utils/date/date.util';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { forkJoin } from 'rxjs';
import { TransactionListComponent } from '../../components/transactions-list/transactions-list.component';
import { TransactionResponse } from '../../domain/transaction/interfaces/TransactionResponse';
import { TransactionService } from '../../domain/transaction/services/transaction.service';
import { TransactionDialogComponent } from '../../components/transactions-list/transactions-dialog/transaction-dialog.component';
import { TransactionDTO } from '../../domain/transaction/interfaces/TransactionDTO';
import { TransactionFormData } from '../../domain/transaction/interfaces/TransactionFormData';
import { TransactionStatus } from '../../domain/types/TransactionStatus';



@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, TransactionListComponent, SearchBarComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionComponent implements OnInit {
  allTransactions: TransactionResponse[] = [];
  filteredTransactions: TransactionResponse[] = [];
  currentPage = 0;
  isLoading = false;
  totalPaid = 0;
  totalPending = 0;
  totalReceive = 0;
  totalAmountOut = 0;
  totalAmountIn = 0;
  balance = 0;

  constructor(
    private snackBar: MatSnackBar,
    private dateService: DateService,
    private dialogService: DialogService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData() {
    this.isLoading = true;
    const transactions$ = this.transactionService.getAll(this.currentPage);
    const out$ = this.transactionService.getTotalAmountByType('PASSIVO');
    const in$ = this.transactionService.getTotalAmountByType('ATIVO');

    forkJoin({
      transactions: transactions$,
      totalOut: out$,
      totalIn: in$,
    }).subscribe({
      next: ({ transactions, totalOut, totalIn}) => {
        this.allTransactions = transactions.content ?? [];
        this.filteredTransactions = [...this.allTransactions];
        this.totalAmountOut = totalOut ?? 0;
        this.totalAmountIn = totalIn ?? 0;
        this.buildStats();
      },
      error: (err) => {
        this.showSnackBar(err?.message ?? JSON.stringify(err), 'error');
      },
      complete: () => this.isLoading = false
    });
  }

  private buildStats() {
    // reset antes de calcular
    this.totalPaid = 0;
    this.balance = 0;
    this.totalPending = 0;
    this.totalReceive = 0;
    this.totalAmountIn = 0;
    this.totalAmountOut = 0;


    for (const ac of this.filteredTransactions) {
      if (ac.status === 'PAID') {
        if (ac.type === 'ATIVO') {
          this.totalReceive += ac.amount;
          this.totalAmountIn += ac.amount;
        }
        else {
          this.totalPaid += ac.amount;
          this.totalAmountOut += ac.amount;
        }
      } else {
        this.totalPending += (ac.type === 'ATIVO' ? ac.amount : -(ac.amount));
      }
    }


    this.balance = this.totalAmountIn - this.totalAmountOut;
    console.log(this.balance);
  }

  onSearch(textInput: string): void {
     if (textInput.trim()) {
        this.filteredTransactions = this.filteredTransactions.filter(a =>
          a.description.toLowerCase().includes(textInput.toLowerCase())
        );
      } else {
        this.filteredTransactions = this.allTransactions;
      }
  }

  onNewTransaction(): void {

    const ref = this.dialogService.open(TransactionDialogComponent, { mode: 'create' });

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.createTransaction(formData);
    });
  }

  onEditTransaction(transaction: TransactionResponse): void {
    const ref = this.dialogService.open(
    TransactionDialogComponent,
      {
        mode: 'edit',
        value: {
          description: transaction.description,
          amount: transaction.amount,
          category: transaction.category.name,
          expirationDate: transaction.expirationDate,
          status: transaction.status == "PAID" ? "PAGO" : "PENDENTE",
          bankAccount: transaction.bankAccount.name,
          type: transaction.type == "PASSIVO" ? "PASSIVO" : "ATIVO"
        },
      }
    );

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.updateTransaction(transaction.id, formData);
    });

  }

  onToggleStatus(transaction: TransactionResponse): void {
    if (transaction.status == "PENDING") {
      this.transactionService.paid(transaction.id).subscribe({
      next: (data) => {
        this.showSnackBar('Conta paga!', 'success');
        transaction.status = data.status
      },
      error: (error: any) => {
        this.showSnackBar(error, "error")
      },
      complete: () => {
        this.buildStats();
      }
      })
    }
    if (transaction.status == "PAID") {
      this.transactionService.refund(transaction.id).subscribe({
      next: (data) => {
        this.showSnackBar('Conta estornada!', 'success');
        transaction.status = data.status
      },
      error: (error: any) => {
        this.showSnackBar(error, 'error')
      },
      complete: () => {
        this.buildStats();
      }
      })
    }

  }

  onDeleteTransaction(transaction: TransactionResponse): void {
    if (confirm(`Excluir N° ${transaction.id}?`)) {
      this.transactionService.delete(transaction.id).subscribe({
        next: () => {
          this.showSnackBar('Lançamento excluída com sucesso!', 'success');
          this.loadAllData();
        },
        error: (error: any) => {
          this.showSnackBar(error, 'error');
        }
      });
    }
  }

  private createTransaction(dto: TransactionDTO): void {
    this.transactionService.add(dto).subscribe({
      next: (transaction: TransactionResponse) => {
        this.filteredTransactions.push(transaction);
        this.showSnackBar('Lançamento criadO com sucesso!', 'success');
      }, error: (error: any) => {
        this.showSnackBar(error, error);
      },
      complete: () => {
        this.buildStats();
      }
    })

  }

  private updateTransaction(id: number, formData: TransactionFormData): void {
    this.transactionService.update(id ,formData).subscribe({
      next: (transaction) => {
        const idx = this.filteredTransactions.findIndex(a => a.id === id);
        if (idx !== -1) {
          this.filteredTransactions[idx] = transaction;
          this.showSnackBar('Lançamento atualizado com sucesso!', 'success');
        }
      },
      error: (error: any) => {
        this.showSnackBar(error, "error");
      },
      complete: () => {
        this.buildStats();
      }
    })

  }

  // isOverdue(expirationDateIso: string): boolean {
  //   const today = new Date();
  //   const due = new Date(expirationDateIso);
  //   return due < today && !this.isSameDay(due, today);
  //   // para considerar vencida se passou do dia
  // }

  // isSameDay(a: Date, b: Date): boolean {
  //   return a.getFullYear() === b.getFullYear() &&
  //          a.getMonth() === b.getMonth() &&
  //          a.getDate() === b.getDate();
  // }

  formatDate(dateString: string): string {
    return this.dateService.formatDateByString(dateString);
  }

  getStatusChip(status: TransactionStatus): { text: string; class: string } {
    switch (status) {
      case 'PAID': return { text: 'PAGO', class: 'chip-paid' };
      default: return { text: 'PENDENTE', class: 'chip-pending' };
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const config = {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    };
    this.snackBar.open(message, 'Fechar', config);
  }
}
