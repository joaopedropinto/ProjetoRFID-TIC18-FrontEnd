import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { map, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of, firstValueFrom } from 'rxjs';

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
          const adaptedProducts: Product[] = notFoundResponses.map(tag => ({
            id: '',  // Define um valor padrão ou um identificador válido
            idCategory: 'unknown', 
            idSupplier: 'unknown', 
            idPackaging: '',  // Adicionei idPackaging com um valor padrão
            name: tag.message || 'Desconhecido',
            rfidTag: tag.rfidTag || '',
            description: '',
            weight: 0,
            manufacDate: new Date(), 
            dueDate: new Date(), 
            unitMeasurement: '', 
            packingType: '', 
            batchNumber: '', 
            quantity: 0,
            price: 0,
            height: 0,
            width: 0,
            length: 0,
            volume: 0
          }));
          const allProducts = [...products, ...adaptedProducts];
          return { products: allProducts, notFoundResponses };
        })
      );
  }
  
  async getProductsByTag(): Promise<ProductsByTagResponse | { error: string, details: string }> {
    try {
      const result = await firstValueFrom(
        this.http.get<ProductsByTagResponse>(`${this.apiUrl}/Product/get-products-by-rfids`)
          .pipe(
            map(response => response),  // Retorna o objeto completo no caso de sucesso
            catchError((error: any) => {
              console.error('Ocorreu um erro ao buscar o produto:', error);
              const errorMessage = error?.message || 'Erro desconhecido';
              return of({ error: 'Erro ao buscar produtos', details: errorMessage });  // Retorna a mensagem de erro
            })
          )
      );
      return result;
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      return { error: 'Erro ao fazer a requisição', details: errorMessage };
    }
  }

  postReadout(readoutDate: string, tags: string[]): Observable<any> {
    const body = {
      readoutDate: readoutDate,
      tags: tags
    };

    return this.http.post(`${this.apiUrl}/Readout`, body);
  }
   getImageUrl(ObjectName: string): Observable<string> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/Product/image-url/${ObjectName}`).pipe(
      map(response => response.url) // Mapeia para obter apenas a URL da resposta
    );
  }
  getProductsByTagRfidsByTime(readingTime: number, page: number = 1, itemsPerPage: number = 10): Observable<{ products: Product[], notFoundResponses: any[] }> {
    const params = new HttpParams()
      .set('ReadingTime', readingTime.toString())
      .set('page', page.toString())
      .set('itemsPerPage', itemsPerPage.toString());

    return this.http.get<{ products: Product[], notFoundResponses: any[] }>(`${this.apiUrl}/Product/get-products-by-rfids-by-time`, { params })
      .pipe(
        map(response => {
          const products = response.products || [];
          const notFoundResponses = response.notFoundResponses || [];
          const adaptedProducts: Product[] = notFoundResponses.map(tag => ({
            id: '',  // Define um valor padrão ou um identificador válido
            idCategory: 'unknown', 
            idSupplier: 'unknown', 
            idPackaging: '',  // Adicionei idPackaging com um valor padrão
            name: tag.message || 'Desconhecido',
            rfidTag: tag.rfidTag || '',
            description: '',
            weight: 0,
            manufacDate: new Date(), 
            dueDate: new Date(), 
            unitMeasurement: '', 
            packingType: '', 
            batchNumber: '', 
            quantity: 0,
            price: 0,
            height: 0,
            width: 0,
            length: 0,
            volume: 0
          }));
          const allProducts = [...products, ...adaptedProducts];
          return { products: allProducts, notFoundResponses };
        })
      );
  }


}

//interface usada para que o codigo reconheça a estrutura do resultado fornecido pelo end point
interface ProductsByTagResponse {
  products: any[];        // O tipo real de produtos pode ser definido conforme necessário
  notFoundResponses: any[]; // O tipo real de notFoundProducts pode ser definido conforme necessário
}