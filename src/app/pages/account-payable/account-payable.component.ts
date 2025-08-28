import { Component, OnInit, signal } from '@angular/core';
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
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-account-payable',
  standalone: true,
  imports: [MainContainerComponent, PageHeaderComponent, SummaryCardsContainerComponent, SummaryCardComponent, AccountsPayableListComponent, SearchBarComponent],
  templateUrl: './account-payable.component.html',
  styleUrls: ['./account-payable.component.scss']
})
export class AccountPayableComponent implements OnInit {
  allAccounts: AccountPayableResponse[] = [];
  filteredAccounts: AccountPayableResponse[] = [];
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
    private accountPayableService: AccountPayableService,
    private bankAccountService: BankAccountService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  private loadAllData() {
    this.isLoading = true;
    const accounts$ = this.accountPayableService.getAll(this.currentPage);
    const out$ = this.accountPayableService.getTotalAmountByType('PASSIVO');
    const in$ = this.accountPayableService.getTotalAmountByType('ATIVO');
    // const balance$ = this.bankAccountService.getCurrentTotalBalance();

    forkJoin({
      accounts: accounts$,
      totalOut: out$,
      totalIn: in$,
    }).subscribe({
      next: ({ accounts, totalOut, totalIn}) => {
        this.allAccounts = accounts.content ?? [];
        this.filteredAccounts = [...this.allAccounts];
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


    for (const ac of this.filteredAccounts) {
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
        this.filteredAccounts = this.filteredAccounts.filter(a =>
          a.description.toLowerCase().includes(textInput.toLowerCase())
        );
      } else {
        this.filteredAccounts = this.allAccounts;
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
          type: account.type == "PASSIVO" ? "PASSIVO" : "ATIVO"
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
      },
      complete: () => {
        this.buildStats();
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
      },
      complete: () => {
        this.buildStats();
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
