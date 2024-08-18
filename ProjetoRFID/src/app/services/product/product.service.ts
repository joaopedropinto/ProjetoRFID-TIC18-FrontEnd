import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(page: number = 1, itemsPerPage: number = 10): Observable<Product[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/Product`, { params });
  }

  getProductById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Product/${id}`);
  }

  postProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/Product`, product);
  }

  putProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/Product`, product);
  }

  deleteProduct(product: Product): Observable<void> {
    const id = product.id;
    return this.http.delete<void>(`${this.apiUrl}/Product/${id}`);
  }
}
