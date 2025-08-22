import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AccountPayableStatus } from '../../types/AccountPayableStatus';
import { DialogData } from '../../interfaces/DialogData';
import { AccountPayable } from '../../interfaces/AccountPayable';
import { CategoryService } from '../../services/category/category.service';
import { CategoryResponse } from '../../interfaces/CategoryResponse';
import { TransactionType } from '../../types/TransactionType';
import { AccountPayableDTO } from '../../interfaces/AccountPayableDTO';
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { BankAccountResponse } from '../../interfaces/BankAccountResponse';


export interface AccountPayableDialogData extends DialogData<AccountPayable>{}

@Component({
  selector: 'app-account-payable-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './accounts-payable-dialog.component.html',
  styleUrls: ['../dialog.shared.scss'],
})
export class AccountPayableDialogComponent {
  readonly statusOptions: string[] = ['PENDENTE', 'PAGO'];

   readonly transctionsType: string[] = ['ATIVO', 'PASSIVO'];

  categories: CategoryResponse[] = [];
  form!: FormGroup;
  accounts: AccountPayable[] = [];
  bankAccounts: BankAccountResponse[] = []

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AccountPayableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountPayableDialogData,
    private categoryService: CategoryService,
    private bankAccountService: BankAccountService
  ) {
    this.form = this.fb.group({
    description: [this.data.value?.description ?? '', [Validators.maxLength(300)]],
    category: [this.data.value?.category ?? '', [Validators.required]],
    bankAccount: [this.data.value?.bankAccount ?? '', [Validators.required]],
    // Para input type="date", se vier ISO convertendo para yyyy-MM-dd ajuda no preenchimento
    expirationDate: [this.toInputDate(this.data.value?.expirationDate) ?? '', [Validators.required]],
    amount: [this.data.value?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
    status: [this.data.value?.status ?? 'PENDENTE', [Validators.required]],
    type: [this.data.value?.type ?? 'PASSIVO', [Validators.required]],
  });
    this.loadActiveCategories();
    this.loadActiveBankAccounts();
  }

  loadActiveCategories() {
    this.categoryService.getAllActive().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    })
  }

  loadActiveBankAccounts() {
    this.bankAccountService.getAllActive().subscribe({
      next: (data) => {
        this.bankAccounts = data;
      },
      error: (error: any) => {
        console.error(error);
      }
    })
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (this.form.valid) {
      // Retorna { description, categoryId, expirationDate, amount, bankAccountId, type }
      const dto: AccountPayableDTO = {
        description: this.form.value.description,
        amount: this.form.value.amount ,
        bankAccountId: this.getBank(),
        categoryId: this.getCategory(),
        status: this.form.value.status == "PENDENTE" ? "PENDING" : "PAID",
        expirationDate: this.form.value.expirationDate,
        type: this.form.value.type,
      }
      this.ref.close(dto);
    }
  }

  private getCategory(): number {
    const cat = this.categories.find(c => c.name.toLowerCase() === this.form.value.category.toLowerCase());
    if(cat != null) {
      return cat.id
    }
    return 0;
  }

  private getBank(): number {
    const bank = this.bankAccounts.find(b => b.name.toLowerCase() === this.form.value.bankAccount.toLowerCase());
    if(bank != null) {
      return bank.id
    }
    return 0;
  }

  private toInputDate(iso?: string): string | null {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }
}
