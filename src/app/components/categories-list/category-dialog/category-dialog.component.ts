import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogData } from '../../../core/interfaces/DialogData';
import { Category } from '../../../domain/category/interfaces/Category';

export interface CategoryDialogData extends DialogData<Category>{}

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './category-dialog.component.html',
  styleUrls: ['../../dialog.shared.scss'],
})
export class CategoryDialogComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoryDialogData
  ) {
    this.form = this.fb.group({
    name: [this.data.value?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    description: [this.data.value?.description ?? '', [Validators.maxLength(200)]],
  });
  }

  close(): void {
    this.ref.close();
  }

  save(): void {
    if (this.form.valid) {
      this.ref.close(this.form.value);
    }
  }
}
