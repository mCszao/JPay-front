import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../interfaces/CategoryResponse';
import { CategoryFormData } from '../../interfaces/CategoryFormData';
import { Category } from '../../interfaces/Category';
import { PageResponse } from '../../interfaces/PageResponse';
import { SpringPageable } from '../../interfaces/SpringPageable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  URL = "http://localhost:8080/api/categories";

  constructor(private http: HttpClient) { }

  getAll(page: number) {
  return this.http
    .get<SpringPageable<Category>>(`${this.URL}?page=${page}&size=100`)
    .pipe(
      map((res: SpringPageable<Category>): PageResponse<Category> => ({
        content: res.content,
        totalElements: res.totalElements,
        totalPages: res.totalPages
      }))
    );
  }

  getAllActive(): Observable<CategoryResponse[]> {
    return this.http
    .get<CategoryResponse[]>(`${this.URL}/active`);
  }

  add(category: CategoryFormData): Observable<CategoryResponse> {
    const resp = this.http.post<CategoryResponse>(this.URL, category);

    return resp;
  }

  update(id: number, category: CategoryFormData): Observable<CategoryResponse>  {
    const resp = this.http.put<CategoryResponse>(this.URL+`/${id}`, category);

    return resp;
  }

  deactivate(id: number) {
    const resp = this.http.patch<CategoryResponse>(this.URL+`/${id}/deactivate`, JSON.stringify({id}));

    return resp;
  }

  mostUsed() {
     return this.http
    .get<CategoryResponse>(`${this.URL}/most-used`);
  }
}
