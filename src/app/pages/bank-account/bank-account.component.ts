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


@Component({
  selector: 'app-bank-account.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, SearchBarComponent, BankAccountsListComponent],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent {

  filteredBankAccounts: BankAccount[] = [];
  searchTerm: string = '';
  showInactive: boolean = false;
  isLoading: boolean = false;
  currentPage: number = 0;
  totalBankAccounts: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private dateService: DateService,
    private bankAccountService: BankAccountService
  ) {
    this.loadBankAccounts();
  }

  private loadBankAccounts(): void {
    this.isLoading = true;

    this.bankAccountService.getAll(this.currentPage).subscribe({
      next: (data: PageResponse<BankAccount>) => {
        this.filteredBankAccounts = data.content;
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

  onSearch(event: any): void {
    if (this.searchTerm.trim()) {
      this.filteredBankAccounts = this.filteredBankAccounts.filter(account =>
        (account.name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (this.showInactive ? true : account.active)
      );
    } else {
      this.loadBankAccounts();
    }
  }

  onFilterChange(event: any): void {
    // Implemente filtros adicionais se necessário
  }

  onToggleInactive(): void {
    this.loadBankAccounts();
  }

  onNewBankAccount(): void {
    // TODO: Abrir modal de criação
    this.showSnackBar('Funcionalidade em desenvolvimento', 'info');
  }

  onEditBankAccount(event: any): void {
    // TODO: Abrir modal de edição
    // this.showSnackBar(`Editar conta: ${account.bankName}`, 'info');
  }

  onToggleStatus(event: any): void {
    // const action = account.active ? 'desativada' : 'ativada';

    // account.active = !account.active;
    // account.updatedAt = new Date().toISOString();

    this.showSnackBar(`Conta ${event} com sucesso!`, 'success');
    this.loadBankAccounts();
  }

  onDeleteBankAccount(event: any): void {
    // if (confirm(`Tem certeza que deseja excluir a conta "${account.bankName}"?`)) {
    //   this.bankAccounts = this.bankAccounts.filter(a => a.id !== account.id);
    //   this.loadBankAccounts();
    //   this.showSnackBar('Conta excluída com sucesso!', 'success');
    // }
  }

  private createBankAccount(formData: BankAccountFormData): void {
    const newAccount: BankAccount = {
      id: Math.max(...this.filteredBankAccounts.map(a => a.id)) + 1,
      name: formData.bankName,
      currentBalance: formData.balance,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.filteredBankAccounts.push(newAccount);
    this.loadBankAccounts();
    this.showSnackBar('Conta criada com sucesso!', 'success');
  }

  private updateBankAccount(id: number, formData: BankAccountFormData): void {
    const accountIndex = this.filteredBankAccounts.findIndex(a => a.id === id);
    if (accountIndex !== -1) {
      this.filteredBankAccounts[accountIndex] = {
        ...this.filteredBankAccounts[accountIndex],
        ...formData,
        updatedAt: new Date().toISOString()
      };
      this.loadBankAccounts();
      this.showSnackBar('Conta atualizada com sucesso!', 'success');
    }
  }

  formatDate(dateString: string): string {
    return this.dateService.formatDate(dateString);
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
