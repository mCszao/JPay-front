import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';
import {SnackbarService} from '../services/snack-bar/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Tenta extrair a mensagem do backend se não pega o error
      const message =
        err.error?.message ||
        err.error?.error ||
        `Erro ${err.status}: ${err.statusText}`;

      snackBar.showSnackBar(message, 'error');
      return throwError(() => new Error(message))})
  );
};
