import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadProductsService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProductsByTagRfids(page: number = 1, itemsPerPage: number = 10): Observable<Product[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/Product/get-products-by-rfids`, { params });
  }
}
