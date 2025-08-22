import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AccountPayableStatus } from '../../types/AccountPayableStatus';


export interface AccountPayableDialogData {
  mode: 'create' | 'edit';
  categories: string[];
  value?: {
    title: string;
    description: string;
    category: string;
    expirationDate: string;
    amount: number;
    status: AccountPayableStatus;
  };
}

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
  readonly statusOptions: AccountPayableStatus[] = ['PENDENTE', 'PAGO', 'VENCIDO'];
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AccountPayableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AccountPayableDialogData
  ) {
    this.form = this.fb.group({
    title: [this.data.value?.title ?? '', [Validators.required, Validators.maxLength(120)]],
    description: [this.data.value?.description ?? '', [Validators.maxLength(300)]],
    category: [this.data.value?.category ?? '', [Validators.required]],
    // Para input type="date", se vier ISO convertendo para yyyy-MM-dd ajuda no preenchimento
    expirationDate: [this.toInputDate(this.data.value?.expirationDate) ?? '', [Validators.required]],
    amount: [this.data.value?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
    status: [this.data.value?.status ?? 'PENDENTE', [Validators.required]],
  });
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (this.form.valid) {
      // Retorna { title, description, category, expirationDate, amount, status }
      this.ref.close(this.form.value);
    }
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
