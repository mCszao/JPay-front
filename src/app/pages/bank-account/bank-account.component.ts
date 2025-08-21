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

@Component({
  selector: 'app-bank-account.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, SearchBarComponent, BankAccountsListComponent],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent {

  bankAccounts: BankAccount[] = [
    {
      id: 1,
      bankName: 'Banco do Brasil',
      accountNumber: '12345-6',
      accountType: 'Corrente',
      balance: 45250.75,
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      bankName: 'Caixa Econômica',
      accountNumber: '65432-1',
      accountType: 'Poupança',
      balance: 12850.30,
      active: true,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 3,
      bankName: 'Nubank',
      accountNumber: '98765-4',
      accountType: 'Corrente',
      balance: 3200.00,
      active: false,
      createdAt: '2024-01-05T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  ];

  filteredBankAccounts: BankAccount[] = [];
  searchTerm: string = '';
  showInactive: boolean = false;
  isLoading: boolean = false;

  totalBankAccounts: number = 0;

  constructor(
    private snackBar: MatSnackBar
  ) {
    this.loadBankAccounts();
  }

  private loadBankAccounts(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.filteredBankAccounts = this.bankAccounts.filter(account =>
        this.showInactive ? true : account.active
      );
      this.totalBankAccounts = this.filteredBankAccounts.length;
      this.isLoading = false;
    }, 500);
  }

  onSearch(event: any): void {
    if (this.searchTerm.trim()) {
      this.filteredBankAccounts = this.bankAccounts.filter(account =>
        (account.bankName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         account.accountNumber.includes(this.searchTerm)) &&
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
      id: Math.max(...this.bankAccounts.map(a => a.id)) + 1,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
      balance: formData.balance,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.bankAccounts.push(newAccount);
    this.loadBankAccounts();
    this.showSnackBar('Conta criada com sucesso!', 'success');
  }

  private updateBankAccount(id: number, formData: BankAccountFormData): void {
    const accountIndex = this.bankAccounts.findIndex(a => a.id === id);
    if (accountIndex !== -1) {
      this.bankAccounts[accountIndex] = {
        ...this.bankAccounts[accountIndex],
        ...formData,
        updatedAt: new Date().toISOString()
      };
      this.loadBankAccounts();
      this.showSnackBar('Conta atualizada com sucesso!', 'success');
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
