import { Component } from '@angular/core';
import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { SummaryCardsContainerComponent } from "../../components/summary-cards-container/summary-cards-container.component";
import { SummaryCardComponent } from "../../components/summary-card/summary-card.component";
import { AccountPayableFormData } from '../../interfaces/AccountPayableFormData';
import { AccountPayable } from '../../interfaces/AccountPayable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountPayableStatus } from '../../types/AccountPayableStatus';
import { AccountsPayableListComponent } from "../../components/accounts-payable-list/accounts-payable-list.component";
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { BankAccountsListComponent } from "../../components/bank-accounts-list/bank-accounts-list.component";
import { DateService } from '../../services/date/date.service';


@Component({
  selector: 'app-account-payable.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, AccountsPayableListComponent, SearchBarComponent],
  templateUrl: './account-payable.component.html',
  styleUrl: './account-payable.component.scss'
})
export class AccountPayableComponent {
  // accounts: AccountPayable[] = [
  //   {
  //     id: 1,
  //     title: 'Conta de Luz - Janeiro',
  //     description: 'Consumo mensal',
  //     category: 'Moradia',
  //     expirationDate: '2024-01-15T00:00:00Z',
  //     amount: 285.50,
  //     status: 'PENDENTE',
  //     createdAt: '2024-01-01T10:00:00Z',
  //     updatedAt: '2024-01-01T10:00:00Z'
  //   },
  //   {
  //     id: 2,
  //     title: 'Supermercado XYZ',
  //     description: 'Compras da semana',
  //     category: 'Alimentação',
  //     expirationDate: '2024-01-11T00:00:00Z',
  //     amount: 450.30,
  //     status: 'VENCIDO',
  //     createdAt: '2024-01-05T10:00:00Z',
  //     updatedAt: '2024-01-12T10:00:00Z'
  //   },
  //   {
  //     id: 3,
  //     title: 'Plano de Saúde',
  //     description: 'Mensalidade',
  //     category: 'Saúde',
  //     expirationDate: '2024-01-19T00:00:00Z',
  //     amount: 680.00,
  //     status: 'PENDENTE',
  //     createdAt: '2024-01-07T10:00:00Z',
  //     updatedAt: '2024-01-07T10:00:00Z'
  //   },
  //   {
  //     id: 4,
  //     title: 'Combustível',
  //     description: 'Abastecimento',
  //     category: 'Transporte',
  //     expirationDate: '2024-01-17T00:00:00Z',
  //     amount: 320.75,
  //     status: 'PENDENTE',
  //     createdAt: '2024-01-08T10:00:00Z',
  //     updatedAt: '2024-01-08T10:00:00Z'
  //   },
  //   {
  //     id: 5,
  //     title: 'Internet Fibra',
  //     description: 'Mensalidade',
  //     category: 'Moradia',
  //     expirationDate: '2024-01-09T00:00:00Z',
  //     amount: 89.90,
  //     status: 'PAGO',
  //     createdAt: '2024-01-02T10:00:00Z',
  //     updatedAt: '2024-01-09T10:00:00Z'
  //   }
  // ];

  filteredAccounts: AccountPayable[] = [];
  searchTerm: string = '';
  selectedStatus: '' | AccountPayableStatus = '';
  selectedCategory: string = '';
  isLoading: boolean = false;

  totalAccounts: number = 0;
  totalDueThisMonth: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private dateService: DateService
  ) {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.isLoading = true;

    setTimeout(() => {
      // aplica filtros básicos
      this.filteredAccounts = this.filteredAccounts
        .filter(a => (this.selectedStatus ? a.status === this.selectedStatus : true))
        .filter(a => (this.selectedCategory ? a.category === this.selectedCategory : true));

      // busca
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        this.filteredAccounts = this.filteredAccounts.filter(a =>
          a.title.toLowerCase().includes(term)
        );
      }

      this.totalAccounts = this.filteredAccounts.length;
      this.totalDueThisMonth = this.filteredAccounts
        .filter(a => a.status !== 'PAGO')
        .reduce((acc, cur) => acc + cur.amount, 0);

      this.isLoading = false;
    }, 300);
  }

  onSearch(_: string): void {
    this.loadAccounts();
  }

  onStatusFilterChange(status: '' | AccountPayableStatus): void {
    this.selectedStatus = status;
    this.loadAccounts();
  }

  onCategoryFilterChange(category: string): void {
    this.selectedCategory = category;
    this.loadAccounts();
  }

  onNewAccountPayable(): void {
    // TODO: abrir modal de criação
    this.showSnackBar('Funcionalidade em desenvolvimento', 'info');
  }

  onEditAccount(event: any): void {
    // TODO: abrir modal de edição
    // this.showSnackBar(`Editar conta: ${account.title}`, 'info');
  }

  onToggleStatus(event: any): void {
    // alterna entre PENDENTE e PAGO; mantém VENCIDO se a data passou
    // if (account.status === 'PAGO') {
    //   account.status = this.isOverdue(account.expirationDate) ? 'VENCIDO' : 'PENDENTE';
    // } else {
    //   account.status = 'PAGO';
    // }
    // account.updatedAt = new Date().toISOString();
    this.showSnackBar('Status atualizado!', 'success');
    this.loadAccounts();
  }

  onDeleteAccount(event: any): void {
    // if (confirm(`Excluir "${account.title}"?`)) {
    //   this.accounts = this.accounts.filter(a => a.id !== account.id);
    //   this.loadAccounts();
    //   this.showSnackBar('Conta excluída com sucesso!', 'success');
    // }
  }

  private createAccount(formData: AccountPayableFormData): void {
    const newAccount: AccountPayable = {
      id: Math.max(...this.filteredAccounts.map(a => a.id)) + 1,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      expirationDate: formData.expirationDate,
      amount: formData.amount,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.filteredAccounts.push(newAccount);
    this.loadAccounts();
    this.showSnackBar('Conta criada com sucesso!', 'success');
  }

  private updateAccount(id: number, formData: AccountPayableFormData): void {
    const idx = this.filteredAccounts.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.filteredAccounts[idx] = { ...this.filteredAccounts[idx], ...formData, updatedAt: new Date().toISOString() };
      this.loadAccounts();
      this.showSnackBar('Conta atualizada com sucesso!', 'success');
    }
  }

  isOverdue(expirationDateIso: string): boolean {
    const today = new Date();
    const due = new Date(expirationDateIso);
    return due < today && !this.isSameDay(due, today);
    // para considerar vencida se passou do dia
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  formatDate(dateString: string): string {
    return this.dateService.formatDate(dateString);
  }

  getStatusChip(status: AccountPayableStatus): { text: string; class: string } {
    switch (status) {
      case 'PAGO': return { text: 'PAGO', class: 'chip-paid' };
      case 'VENCIDO': return { text: 'VENCIDO', class: 'chip-overdue' };
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
