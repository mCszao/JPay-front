import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpringPageable } from '../../interfaces/SpringPageable';
import { BankAccount } from '../../interfaces/BankAccount';
import { PageResponse } from '../../interfaces/PageResponse';
import { BankAccountFormData } from '../../interfaces/BankAccountFormData';
import { map } from 'rxjs/operators';
import { BankAccountResponse } from '../../interfaces/BankAccountResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  URL = "http://localhost:8080/api/bank-accounts";

  constructor(private http: HttpClient) { }

  getAll(page: number) {
  return this.http
    .get<SpringPageable<BankAccount>>(`${this.URL}?page=${page}&size=100`)
    .pipe(
      map((res: SpringPageable<BankAccount>): PageResponse<BankAccount> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
}

  add(category: BankAccountFormData): Observable<BankAccountResponse> {
    const resp = this.http.post<BankAccountResponse>(this.URL, category);

    return resp;
  }

  update(id: number, category: BankAccountFormData): Observable<BankAccountResponse>  {
    const resp = this.http.put<BankAccountResponse>(this.URL+`/${id}`, category);

    return resp;
  }

  deactivate(id: number) {
    const resp = this.http.patch<BankAccountResponse>(this.URL+`/${id}/deactivate`, JSON.stringify({id}));

    return resp;
  }
}
