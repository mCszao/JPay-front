// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Tenta extrair a mensagem amigável do backend
      const message =
        err.error?.message ||
        err.error?.error ||
        `Erro ${err.status}: ${err.statusText}`;


      return throwError(() => new Error(message))})
  );
};
