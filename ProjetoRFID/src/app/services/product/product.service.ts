import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Product } from '../../models/product.model';
import { PackagingService } from '../packaging/packaging.service';
import { Packaging } from '../../models/packaging.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private packagingService: PackagingService) { }

  getProducts(page: number = 1, itemsPerPage: number = 10): Observable<Product[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/Product`, { params });
  }

  getProductById(id: number | string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Product/${id}`);
  }

  getProductByRfid(rfid: string): Observable<Product> {
    const params = new HttpParams().set('RfidTag', rfid);
    return this.http.get<Product>(`${this.apiUrl}/Product/get-product-by-rfid`, { params });
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

  getImageUrl(ObjectName: string): Observable<string> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/Product/image-url/${ObjectName}`).pipe(
      map(response => response.url) // Mapeia para obter apenas a URL da resposta
    );
  }
  

  returnAllActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Product/active`).pipe(
      map((produtos: Product[]) => {
        // Se não houver produtos, retorna um array vazio imediatamente(previne o loop do loading infinito)
        if (produtos.length === 0) {
          return [];
        }
        // Mapeia os produtos para adicionar o nome da embalagem
        return produtos.map(produto => {
          return this.packagingService.getPackagingById(produto.idPackaging).pipe(
            map(embalagem => {
              return {
                ...produto,
                packingType: embalagem.name
              };
            })
          );
        });
      }),
      switchMap(observablesDeProdutos => {
        // Se a lista for vazia, retorna um Observable de array vazio
        if (observablesDeProdutos.length === 0) {
          return of([]); // Observable de array vazio
        }
        // Combina todos os observables em um só Observable
        return forkJoin(observablesDeProdutos);
      })
    );
  }
}
