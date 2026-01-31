import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SpringPageable} from '../../../core/interfaces/SpringPageable';
import {Category} from '../interfaces/Category';
import {PageResponse} from '../../../core/interfaces/PageResponse';
import {CategoryResponse} from '../interfaces/CategoryResponse';
import {CategoryFormData} from '../interfaces/CategoryFormData';
import {CategoryTotals} from '../interfaces/CategoryTotals';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  URL = `${environment.baseApiUrl}categories`;

  constructor(private http: HttpClient) {
  }

  getAll(page: number) {
    return this.http.get<SpringPageable<Category>>(`${this.URL}?page=${page}&size=100`)
      .pipe(
        map((res: SpringPageable<Category>): PageResponse<Category> => ({
          content: res.content,
          totalElements: res.totalElements,
          totalPages: res.totalPages
        }))
      );
  }

  getAllActive(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.URL}/active`);
  }

  add(category: CategoryFormData): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.URL, category);
  }

  update(id: number, category: CategoryFormData): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(this.URL + `/${id}`, category);
  }

  deactivate(id: number) {
    return this.http.patch<CategoryResponse>(this.URL + `/${id}/deactivate`, JSON.stringify({id}));
  }

  delete(id: number) {
    return this.http.delete<CategoryResponse>(this.URL + `/${id}`);
  }

  mostUsed() {
    return this.http.get<CategoryResponse>(`${this.URL}/most-used`);
  }

  expensesByCategory() {
    return this.http.get<CategoryTotals[]>(`${this.URL}/total`);
  }
}
