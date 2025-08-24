import { Component } from '@angular/core';
import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { SummaryCardsContainerComponent } from "../../components/summary-cards-container/summary-cards-container.component";
import { SummaryCardComponent } from "../../components/summary-card/summary-card.component";
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { BankAccount } from '../../interfaces/BankAccount';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankAccountFormData } from '../../interfaces/BankAccountFormData';
import { BankAccountsListComponent } from "../../components/bank-accounts-list/bank-accounts-list.component";
import { DateService } from '../../services/date/date.service';
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { PageResponse } from '../../interfaces/PageResponse';
import { BankAccountsDialogComponent } from '../../components/bank-accounts-dialog/bank-accounts-dialog.component';
import { DialogService } from '../../services/dialog.service';
import { BankAccountResponse } from '../../interfaces/BankAccountResponse';


@Component({
  selector: 'app-bank-account.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, SearchBarComponent, BankAccountsListComponent],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent {

  filteredBankAccounts: BankAccountResponse[] = [];
  showInactive: boolean = false;
  isLoading: boolean = false;
  currentPage: number = 0;
  totalBankAccounts: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private dateService: DateService,
    private bankAccountService: BankAccountService,
    private dialogService: DialogService
  ) {
    this.loadBankAccounts();
  }

  private loadBankAccounts(): void {
    this.isLoading = true;

    this.bankAccountService.getAll(this.currentPage).subscribe({
      next: (data: PageResponse<BankAccount>) => {
        this.filteredBankAccounts = data.content;
      }, error: (error: any) => {
        this.showSnackBar(error.message, 'error');
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
    // TODO: Abrir modal de criação
    const ref = this.dialogService.open(BankAccountsDialogComponent, { mode: 'create' });

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

  onDeleteBankAccount(event: any): void {
    // if (confirm(`Tem certeza que deseja excluir a conta "${account.bankName}"?`)) {
    //   this.bankAccounts = this.bankAccounts.filter(a => a.id !== account.id);
    //   this.loadBankAccounts();
    //   this.showSnackBar('Conta excluída com sucesso!', 'success');
    // }
  }

  private createBankAccount(formData: BankAccountFormData): void {
    this.bankAccountService.add(formData).subscribe({
      next: (data: BankAccountResponse) => {
        this.filteredBankAccounts.push(data);
        this.showSnackBar('Conta criada com sucesso!', 'success');
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
