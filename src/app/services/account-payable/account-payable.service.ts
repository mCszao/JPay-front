import { Injectable } from '@angular/core';
import { AccountPayable } from '../../interfaces/AccountPayable';
import { SpringPageable } from '../../interfaces/SpringPageable';
import { PageResponse } from '../../interfaces/PageResponse';
import { HttpClient } from '@angular/common/http';
import { AccountPayableFormData } from '../../interfaces/AccountPayableFormData';
import { AccountPayableResponse } from '../../interfaces/AccountPayableResponse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountPayableService {
  URL = "http://localhost:8080/api/bank-accounts";

  constructor(private http: HttpClient) { }

  getAll(page: number) {
  return this.http
    .get<SpringPageable<AccountPayable>>(`${this.URL}?page=${page}&size=100`)
    .pipe(
      map((res: SpringPageable<AccountPayable>): PageResponse<AccountPayable> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
}

  add(category: AccountPayableFormData): Observable<AccountPayableResponse> {
    const resp = this.http.post<AccountPayableResponse>(this.URL, category);

    return resp;
  }

  update(id: number, category: AccountPayableFormData): Observable<AccountPayableResponse>  {
    const resp = this.http.put<AccountPayableResponse>(this.URL+`/${id}`, category);

    return resp;
  }

  deactivate(id: number) {
    const resp = this.http.patch<AccountPayableResponse>(this.URL+`/${id}/deactivate`, JSON.stringify({id}));

    return resp;
  }
}
