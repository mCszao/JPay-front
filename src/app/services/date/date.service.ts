import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  formatDateByString(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  formatDateByDateObject(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }
}
