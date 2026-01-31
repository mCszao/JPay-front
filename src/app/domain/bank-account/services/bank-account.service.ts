import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BankAccount} from '../interfaces/BankAccount';
import {BankAccountResponse} from '../interfaces/BankAccountResponse';
import {BankAccountFormData} from '../interfaces/BankAccountFormData';
import {map} from 'rxjs/operators';
import {SpringPageable} from '../../../core/interfaces/SpringPageable';
import {PageResponse} from '../../../core/interfaces/PageResponse';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  URL = `${environment.baseApiUrl}bank-accounts`;

  constructor(private http: HttpClient) {
  }

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

  getAllActive(): Observable<BankAccountResponse[]> {
    return this.http.get<BankAccountResponse[]>(`${this.URL}/active`);
  }

  getCurrentTotalBalance(): Observable<number> {
    return this.http.get<number>(`${this.URL}/total-balance`);
  }

  add(bankAccount: BankAccountFormData): Observable<BankAccountResponse> {
    return this.http.post<BankAccountResponse>(this.URL, bankAccount);
  }


  update(id: number, bankAccount: BankAccountFormData): Observable<BankAccountResponse> {
    return this.http.put<BankAccountResponse>(this.URL + `/${id}`, bankAccount);
  }

  deactivate(id: number) {
    return this.http.patch<BankAccountResponse>(this.URL + `/${id}/deactivate`,{});
  }

  delete(id: number) {
    return this.http.delete<BankAccountResponse>(this.URL + `/${id}`);
  }

}
