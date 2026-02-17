import {Component, OnInit} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from "@angular/material/icon"
import {MatCardModule} from "@angular/material/card"
import {MatChipsModule} from "@angular/material/chips"
import {MatButtonModule} from "@angular/material/button"
import {NgxChartsModule} from "@swimlane/ngx-charts"
import {SummaryCardComponent} from '../../components/summary-card/summary-card.component';
import {
  SummaryCardsContainerComponent
} from '../../components/summary-card/summary-cards-container/summary-cards-container.component';
import {PageHeaderComponent} from "../../components/page-header/page-header.component";
import {MainContainerComponent} from '../../components/main-container/main-container.component';
import {CategoryTotals} from '../../domain/category/interfaces/CategoryTotals';
import {DateService} from '../../core/utils/date/date.util';
import {TransactionResponse} from '../../domain/transaction/interfaces/TransactionResponse';
import {CategoryService} from '../../domain/category/services/category.service';
import {TransactionService} from '../../domain/transaction/services/transaction.service';
import {BankAccountService} from '../../domain/bank-account/services/bank-account.service';
import {Router} from '@angular/router';
import {DialogService} from '../../core/services/dialog/dialog.service';
import {
  TransactionDialogComponent
} from '../../components/transactions-list/transactions-dialog/transaction-dialog.component';
import {TransactionFormData} from '../../domain/transaction/interfaces/TransactionFormData';
import {SnackbarService} from '../../core/services/snack-bar/snackbar.service';

export interface SummaryData {
  totalBalance: number;
  totalAccounts: number;
  overdueAccounts: number;
  paidThisMonth: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatCardModule, MatChipsModule, NgxChartsModule, MatButtonModule, SummaryCardsContainerComponent, SummaryCardComponent, PageHeaderComponent, MainContainerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  currentPage = 0;
  totalAmountOut: number = 0;
  totalAmountIn: number = 0;
  currentTotalBalance: number = 0;
  // summaryData: SummaryData = {
  //   totalBalance: 0,
  //   totalAccounts: 24,
  //   overdueAccounts: 3,
  //   paidThisMonth: 12850.30
  // };

  categories: CategoryTotals[] = []

  recentTransactions: TransactionResponse[] = [];

  constructor(private categoryService: CategoryService, private snackBar: SnackbarService, private transactionService: TransactionService, private dialogService: DialogService, private bankAccountService: BankAccountService, private dateService: DateService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadSummaryCards() {
    this.transactionService.getTotalAmountByType('PASSIVO').subscribe(
      {
        next: (data) => {
          this.totalAmountOut = data;
        },
        error: (error: any) => {
          this.snackBar.showSnackBar(error, "error");
        }
      });

    this.transactionService.getTotalAmountByType('ATIVO').subscribe(
      {
        next: (data) => {
          this.totalAmountIn = data;
        },
        error: (error: any) => {
          this.snackBar.showSnackBar(error, "error");
        }
      });

    this.bankAccountService.getCurrentTotalBalance().subscribe(
      {
        next: (data) => {
          this.currentTotalBalance = data;
        },
        error: (error: any) => {
          this.snackBar.showSnackBar(error, "error");
        }
      });
  }

  private loadDashboardData(): void {
    this.loadSummaryCards()
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const formattedStartDate = this.dateService.formatDateByDateObject(startDate);
    const formattedEndDate = this.dateService.formatDateByDateObject(endDate);
    this.transactionService.getByExpirationDateBetweenAndType(formattedStartDate, formattedEndDate, 'PASSIVO', this.currentPage).subscribe(
      {
        next: (data) => {
          this.recentTransactions = data.content;
        },
        error: (error: any) => {
          this.snackBar.showSnackBar(error, "error");
        }
      });
    this.categoryService.expensesByCategory().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error: any) => {
        this.snackBar.showSnackBar(error, "error");
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return this.dateService.formatDateByString(dateString);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PAID':
        return '#2cad31ff';
      case 'PENDING':
        return 'rgba(193,134,52,0.78)';
      case 'OVERDUE':
        return '#F44336';
      default:
        return 'none';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAID':
        return 'Pago';
      case 'PENDING':
        return 'Pendente';
      case 'OVERDUE':
        return 'Vencido';
      default:
        return status;
    }
  }

  onOpenTransaction(transaction: TransactionResponse) {
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

  updateTransaction(id: number,formData: TransactionFormData) {
    this.transactionService.update(id ,formData).subscribe({
      next: (transaction) => {
        this.snackBar.showSnackBar('Lançamento atualizado com sucesso!', 'success');
      },
      error: (error: any) => {
        this.snackBar.showSnackBar(error, "error");
      },
      complete: () => {
        this.loadDashboardData();
      }
    })
  }

  onViewAllAccounts(): void {
    this.router.navigate(['/transactions']);
  }
}
