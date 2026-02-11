import {Component, OnInit, signal} from '@angular/core';
import {MainContainerComponent} from "../../components/main-container/main-container.component";
import {PageHeaderComponent} from "../../components/page-header/page-header.component";
import {
  SummaryCardsContainerComponent
} from "../../components/summary-card/summary-cards-container/summary-cards-container.component";
import {SummaryCardComponent} from "../../components/summary-card/summary-card.component";
import {SearchBarComponent} from "../../components/search-bar/search-bar.component";
import {MatSnackBar} from '@angular/material/snack-bar';
import {BankAccountsListComponent} from "../../components/bank-accounts-list/bank-accounts-list.component";
import {DateService} from '../../core/utils/date/date.util';
import {PageResponse} from '../../core/interfaces/PageResponse';
import {
  BankAccountsDialogComponent
} from '../../components/bank-accounts-list/bank-accounts-dialog/bank-accounts-dialog.component';
import {DialogService} from '../../core/services/dialog/dialog.service';
import {BankAccountService} from '../../domain/bank-account/services/bank-account.service';
import {BankAccount} from '../../domain/bank-account/interfaces/BankAccount';
import {BankAccountFormData} from '../../domain/bank-account/interfaces/BankAccountFormData';
import {BankAccountResponse} from '../../domain/bank-account/interfaces/BankAccountResponse';
import {BankAccountCardsInfo} from '../../domain/bank-account/interfaces/BankAccountCardsInfo';
import {forkJoin} from 'rxjs';


@Component({
  selector: 'app-bank-account.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, SearchBarComponent, BankAccountsListComponent],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent implements OnInit {

  filteredBankAccounts: BankAccountResponse[] = [];
  showInactive: boolean = true;
  isLoading: boolean = false;
  currentPage: number = 0;
  totalQuantity = signal(0);
  mvp = signal({} as BankAccountResponse)
  mostUsed = signal({} as BankAccountResponse)

  get getAccounts(): BankAccount[] {
    if (!this.showInactive) return this.filteredBankAccounts.filter(b => b.active)
    return this.filteredBankAccounts;
  }

  constructor(private snackBar: MatSnackBar, private dateService: DateService, private bankAccountService: BankAccountService, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.loadBankAccounts();
  }

  private loadBankAccounts(): void {
    this.isLoading = true;


    this.bankAccountService.getAll(this.currentPage).subscribe({
      next: (data: PageResponse<BankAccount>) => {
        this.filteredBankAccounts = data.content;
      },
      error: (error: any) => {
        this.showSnackBar(error.message, 'error');
      },
      complete: () => {
        this.buildStats();
      }
    })

    // setTimeout(() => {
    //   this.filteredBankAccounts = this.filteredBankAccounts.filter(account =>
    //     this.showInactive ? true : account.active
    //   );
    //   this.totalBankAccounts = this.filteredBankAccounts.length;
    //   this.isLoading = false;
    // }, 500);
  }

  onSearch(textInput: string): void {
    if (textInput.trim()) {
      this.filteredBankAccounts = this.filteredBankAccounts.filter(bank =>
        (bank.name.toLowerCase().includes(textInput.toLowerCase()) || bank.bank.toLowerCase().includes(textInput.toLowerCase())) &&
        (this.showInactive ? true : bank.active)
      );
    } else {
      this.loadBankAccounts();
    }
  }

  onNewBankAccount(): void {
    const ref = this.dialogService.open(BankAccountsDialogComponent, {mode: 'create'});

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.createBankAccount(formData);
    });
  }

  onEditBankAccount(bankAccount: BankAccount): void {
    const ref = this.dialogService.open(
      BankAccountsDialogComponent,
      {
        mode: 'edit',
        value: {
          name: bankAccount.name,
          bank: bankAccount.bank,
          currentBalance: bankAccount.currentBalance,
        },
      }
    );

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.updateBankAccount(bankAccount.id, formData);
    });
  }

  onToggleStatus(bankAccount: BankAccount): void {
    const action = bankAccount.active ? 'desativada' : 'ativada';
    this.bankAccountService.deactivate(bankAccount.id).subscribe({
      next: () => {
        this.showSnackBar(`Conta ${action} com sucesso!`, 'success');
        bankAccount.active = !bankAccount.active
      },
      error: (error: any) => {
        this.showSnackBar(error.message, 'error');
      }
    });

  }

  onDeleteBankAccount(account: BankAccount): void {
    if (confirm(`Tem certeza que deseja excluir a conta "${account.name}"?`)) {
      this.bankAccountService.delete(account.id).subscribe({
        next: () => {
          this.showSnackBar(`Conta deletada com sucesso!`, 'success');
          this.loadBankAccounts();
        },
        error: (error: any) => {
          this.showSnackBar(error.message, 'error');
        }
      })
    }
  }

  protected onCheckedActive(event: boolean) {
    this.showInactive = event
    this.loadBankAccounts()
  }

  private buildStats(): void {
    const mvp$ = this.bankAccountService.getMvp()
    const totalQtd$ = this.bankAccountService.getTotalQuantity()
    const mostUsed$ = this.bankAccountService.getMostUsed()

    forkJoin({
      mvp: mvp$,
      totalQtd: totalQtd$,
      mostUsed: mostUsed$,
    }).subscribe({
      next: ({mvp, totalQtd, mostUsed}) => {
        this.mvp.set(mvp)
        this.totalQuantity.set(totalQtd)
        this.mostUsed.set(mostUsed)
      },
      error: (err) => {
        this.showSnackBar(err?.message ?? JSON.stringify(err), 'error');
      },
      complete: () => this.isLoading = false
    });
  }

  private createBankAccount(formData: BankAccountFormData): void {
    this.bankAccountService.add(formData).subscribe({
      next: (data: BankAccountResponse) => {
        this.showSnackBar('Conta criada com sucesso!', 'success');
        this.loadBankAccounts();
      },
      error: (error: any) => {
        this.showSnackBar(error, "error");
      }
    })
  }

  private updateBankAccount(id: number, formData: BankAccountFormData): void {
    this.bankAccountService.update(id, formData).subscribe({
      next: (data: BankAccountResponse) => {
        const accountIndex = this.filteredBankAccounts.findIndex(a => a.id === id);
        if (accountIndex !== -1) {
          this.filteredBankAccounts[accountIndex] = data;
          this.showSnackBar('Conta atualizada com sucesso!', 'success');
        }
      },
      error: (error: any) => {
        this.showSnackBar(error, "error");
      }
    })


  }

  formatDate(dateString: string): string {
    return this.dateService.formatDateByString(dateString);
  }

  getStatusText(active: boolean): string {
    return active ? 'Ativa' : 'Inativa';
  }

  getStatusColor(active: boolean): string {
    return active ? '#4CAF50' : '#757575';
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const config = {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Fechar', config);
  }

}
