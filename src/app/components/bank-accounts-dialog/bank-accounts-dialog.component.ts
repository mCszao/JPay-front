import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

export interface BankAccountDialogData {
  mode: 'create' | 'edit';
  value?: {
    bankName: string;
    accountNumber: string;
    accountType: 'Corrente' | 'Poupança';
    balance: number;
  };
}

@Component({
  selector: 'app-bank-accounts-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './bank-accounts-dialog.component.html',
  styleUrls: ['../dialog.shared.scss']
})
export class BankAccountsDialogComponent {
  form!: FormGroup;
  accountTypes: Array<'Corrente' | 'Poupança'> = ['Corrente', 'Poupança'];

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<BankAccountsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BankAccountDialogData
  ) {
    this.form = this.fb.group({
    bankName: [this.data.value?.bankName ?? '', [Validators.required, Validators.maxLength(100)]],
    accountNumber: [this.data.value?.accountNumber ?? '', [Validators.required, Validators.maxLength(30)]],
    accountType: [this.data.value?.accountType ?? 'Corrente', [Validators.required]],
    balance: [this.data.value?.balance ?? 0, [Validators.min(0)]],
  });
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (this.form.valid) {
      // retorna { bankName, accountNumber, accountType, balance }
      this.ref.close(this.form.value);
    }
  }
}
