import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private dialog: MatDialog) {}

  open<T, D = unknown>(component: any, data?: D, config?: MatDialogConfig<D>) {
    return this.dialog.open<T, D>(component, {
      data,
      autoFocus: false,
      restoreFocus: true,
      ...config,
    });
  }
}
