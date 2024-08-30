import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadProductsService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProductsByTagRfids(page: number = 1, itemsPerPage: number = 10): Observable<{ products: Product[], notFoundResponses: any[] }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    return this.http.get<{ products: Product[], notFoundResponses: any[] }>(`${this.apiUrl}/Product/get-products-by-rfids`, { params })
      .pipe(
        map(response => {
          const products = response.products || [];
          const notFoundResponses = response.notFoundResponses || [];
          return { products, notFoundResponses };
        })
      );
  }
}
