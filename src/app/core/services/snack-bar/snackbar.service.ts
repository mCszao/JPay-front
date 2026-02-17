import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {
  }

  public showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    const config = {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, 'Fechar', config);
  }
}
