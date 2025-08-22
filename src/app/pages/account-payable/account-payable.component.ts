import { Component } from '@angular/core';
import { MainContainerComponent } from "../../components/main-container/main-container.component";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { SummaryCardsContainerComponent } from "../../components/summary-cards-container/summary-cards-container.component";
import { SummaryCardComponent } from "../../components/summary-card/summary-card.component";
import { AccountPayableFormData } from '../../interfaces/AccountPayableFormData';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountPayableStatus } from '../../types/AccountPayableStatus';
import { AccountsPayableListComponent } from "../../components/accounts-payable-list/accounts-payable-list.component";
import { SearchBarComponent } from "../../components/search-bar/search-bar.component";
import { DateService } from '../../services/date/date.service';
import { AccountPayableDialogComponent } from '../../components/accounts-payable-dialog/accounts-payable-dialog.component';
import { DialogService } from '../../services/dialog.service';
import { AccountPayableService } from '../../services/account-payable/account-payable.service';
import { AccountPayableResponse } from '../../interfaces/AccountPayableResponse';
import { AccountPayableDTO } from '../../interfaces/AccountPayableDTO';


@Component({
  selector: 'app-account-payable.component',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, AccountsPayableListComponent, SearchBarComponent],
templateUrl: './account-payable.component.html',
  styleUrl: './account-payable.component.scss'
})
export class AccountPayableComponent {

  filteredAccounts: AccountPayableResponse[] = [];
  currentPage: number = 0;
  // selectedStatus: '' | AccountPayableStatus = '';
  // selectedCategory: string = '';
  isLoading: boolean = false;

  totalAccounts: number = 0;
  totalDueThisMonth: number = 0;

  constructor(
    private snackBar: MatSnackBar,
    private dateService: DateService,
    private dialogService: DialogService,
    private accountPayableService: AccountPayableService,
  ) {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.isLoading = true;

    this.accountPayableService.getAll(this.currentPage).subscribe({
      next: (data) => {
        this.filteredAccounts = data.content;
      },
      error: (error: any) => {
        this.showSnackBar(error, "error");
      }
    })

    // setTimeout(() => {
    //   // aplica filtros básicos
    //   this.filteredAccounts = this.filteredAccounts
    //     .filter(a => (this.selectedStatus ? a.status === this.selectedStatus : true))
    //     .filter(a => (this.selectedCategory ? a.category === this.selectedCategory : true));

    //   this.totalAccounts = this.filteredAccounts.length;
    //   this.totalDueThisMonth = this.filteredAccounts
    //     .filter(a => a.status !== 'PAGO')
    //     .reduce((acc, cur) => acc + cur.amount, 0);

    //   this.isLoading = false;
    // }, 300);
  }

  onSearch(textInput: string): void {
     if (textInput.trim()) {
        this.filteredAccounts = this.filteredAccounts.filter(a =>
          a.description.toLowerCase().includes(textInput.toLowerCase())
        );
      } else {
        this.loadAccounts();
      }
  }

  onNewAccountPayable(): void {
    // TODO: abrir modal de criação
    const ref = this.dialogService.open(AccountPayableDialogComponent, { mode: 'create' });

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.createAccount(formData);
    });
  }

  onEditAccount(account: AccountPayableResponse): void {
    const ref = this.dialogService.open(
    AccountPayableDialogComponent,
      {
        mode: 'edit',
        value: {
          description: account.description,
          amount: account.amount,
          category: account.category.name,
          expirationDate: account.expirationDate,
          status: account.status == "PAID" ? "PAGO" : "PENDENTE",
          bankAccount: account.bankAccount.name,
          tyoe: account.type == "PASSIVO" ? "PASSIVO" : "ATIVO"
        },
      }
    );

    ref.afterClosed().subscribe(formData => {
      if (!formData) return;
      this.updateAccount(account.id, formData);
    });

  }

  onToggleStatus(account: AccountPayableResponse): void {
    // alterna entre PENDENTE e PAGO; mantém VENCIDO se a data passou

    this.accountPayableService.paid(account.id).subscribe({
      next: (data) => {
        this.showSnackBar('Status atualizado!', 'success');
        account.status = data.status
      },
      error: (error: any) => {
        this.showSnackBar(error, "error")
      }
    })

  }

  onDeleteAccount(event: any): void {
    // if (confirm(`Excluir "${account.title}"?`)) {
    //   this.accounts = this.accounts.filter(a => a.id !== account.id);
    //   this.loadAccounts();
    //   this.showSnackBar('Conta excluída com sucesso!', 'success');
    // }
  }

  private createAccount(dto: AccountPayableDTO): void {
    this.accountPayableService.add(dto).subscribe({
      next: (account: AccountPayableResponse) => {
        this.filteredAccounts.push(account);
        this.showSnackBar('Conta criada com sucesso!', 'success');
      }, error: (error: any) => {
        this.showSnackBar(error, error);
      }
    })

  }

  private updateAccount(id: number, formData: AccountPayableFormData): void {
    this.accountPayableService.update(id ,formData).subscribe({
      next: (account) => {
        const idx = this.filteredAccounts.findIndex(a => a.id === id);
        if (idx !== -1) {
          this.filteredAccounts[idx] = account;
          this.showSnackBar('Conta atualizada com sucesso!', 'success');
        }
      },
      error: (error: any) => {
        this.showSnackBar(error, "error");
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
    return this.dateService.formatDate(dateString);
  }

  getStatusChip(status: AccountPayableStatus): { text: string; class: string } {
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
