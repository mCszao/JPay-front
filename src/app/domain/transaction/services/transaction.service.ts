import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpringPageable } from '../../../core/interfaces/SpringPageable';
import { PageResponse } from '../../../core/interfaces/PageResponse';
import { TransactionResponse } from '../interfaces/TransactionResponse';
import { TransactionFormData } from '../interfaces/TransactionFormData';
import { TransactionDTO } from '../interfaces/TransactionDTO';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  URL = "http://localhost:8080/api/transactions";

  constructor(private http: HttpClient) { }

  getAll(page: number) {
  return this.http
    .get<SpringPageable<TransactionResponse>>(`${this.URL}?page=${page}&size=100`)
    .pipe(
      map((res: SpringPageable<TransactionResponse>): PageResponse<TransactionResponse> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
  }

    getByExpirationDateBetween(startDate: string, endDate: string, page: number) {
  return this.http
    .get<SpringPageable<TransactionResponse>>(`${this.URL}/expired-date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=100`)
    .pipe(
      map((res: SpringPageable<TransactionResponse>): PageResponse<TransactionResponse> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
  }

  getByExpirationDateBetweenAndType(startDate: string, endDate: string, type: string, page: number) {
  return this.http
    .get<SpringPageable<TransactionResponse>>(`${this.URL}/expired-date-range-type?startDate=${startDate}&endDate=${endDate}&page=${page}&type=${type.toLocaleUpperCase()}&size=100`)
    .pipe(
      map((res: SpringPageable<TransactionResponse>): PageResponse<TransactionResponse> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
  }

  getTotalAmountByType(type: string) {
    return this.http.get<number>(`${this.URL}/total-amount?type=${type}`);
  }

  add(account: TransactionDTO): Observable<TransactionResponse> {
    const resp = this.http.post<TransactionResponse>(this.URL, account);

    return resp;
  }

  update(id: number, account: TransactionFormData): Observable<TransactionResponse>  {
    const resp = this.http.put<TransactionResponse>(this.URL+`/${id}`, account);

    return resp;
  }

  paid(id: number): Observable<TransactionResponse> {
     const resp = this.http.post<TransactionResponse>(this.URL+`/${id}/pay`, {});

    return resp;
  }


}
