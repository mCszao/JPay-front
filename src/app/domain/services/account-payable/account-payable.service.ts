import { Injectable } from '@angular/core';
import { AccountPayable } from '../../interfaces/AccountPayable';
import { SpringPageable } from '../../interfaces/SpringPageable';
import { PageResponse } from '../../interfaces/PageResponse';
import { HttpClient } from '@angular/common/http';
import { AccountPayableFormData } from '../../interfaces/AccountPayableFormData';
import { AccountPayableResponse } from '../../interfaces/AccountPayableResponse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountPayableDTO } from '../../interfaces/AccountPayableDTO';

@Injectable({
  providedIn: 'root'
})
export class AccountPayableService {
  URL = "http://localhost:8080/api/accounts-payable";

  constructor(private http: HttpClient) { }

  getAll(page: number) {
  return this.http
    .get<SpringPageable<AccountPayableResponse>>(`${this.URL}?page=${page}&size=100`)
    .pipe(
      map((res: SpringPageable<AccountPayableResponse>): PageResponse<AccountPayableResponse> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
  }

    getByExpirationDateBetween(startDate: string, endDate: string, page: number) {
  return this.http
    .get<SpringPageable<AccountPayableResponse>>(`${this.URL}/due-date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=100`)
    .pipe(
      map((res: SpringPageable<AccountPayableResponse>): PageResponse<AccountPayableResponse> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
  }

  getByExpirationDateBetweenAndType(startDate: string, endDate: string, type: string, page: number) {
  return this.http
    .get<SpringPageable<AccountPayableResponse>>(`${this.URL}/due-date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&type=${type.toLocaleUpperCase()}&size=100`)
    .pipe(
      map((res: SpringPageable<AccountPayableResponse>): PageResponse<AccountPayableResponse> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
  }

  getTotalAmountByType(type: string) {
    return this.http.get<number>(`${this.URL}/total-amount?type=${type}`);
  }

  add(account: AccountPayableDTO): Observable<AccountPayableResponse> {
    const resp = this.http.post<AccountPayableResponse>(this.URL, account);

    return resp;
  }

  update(id: number, account: AccountPayableFormData): Observable<AccountPayableResponse>  {
    const resp = this.http.put<AccountPayableResponse>(this.URL+`/${id}`, account);

    return resp;
  }

  paid(id: number): Observable<AccountPayableResponse> {
     const resp = this.http.post<AccountPayableResponse>(this.URL+`/${id}/pay`, {});

    return resp;
  }


}
