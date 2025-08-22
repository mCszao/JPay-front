import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DialogData } from '../../interfaces/DialogData';
import { BankAccount } from '../../interfaces/BankAccount';

interface BankAccountDialogData extends DialogData<BankAccount> {}

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

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<BankAccountsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BankAccountDialogData
  ) {
    this.form = this.fb.group({
    name: [this.data.value?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    bank: [this.data.value?.bank ?? '', [Validators.required, Validators.maxLength(100)]],
    currentBalance: [this.data.value?.currentBalance ?? 0, [Validators.min(0)]],
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
