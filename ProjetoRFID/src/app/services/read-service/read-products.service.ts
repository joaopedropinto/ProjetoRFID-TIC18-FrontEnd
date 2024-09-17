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

  async getProductsByTag(tag: string): Promise<string> {
    try {
      const result = await firstValueFrom(
        this.http.get(`${this.apiUrl}/Product/get-product-by-rfid?RfidTag=${tag}`)
          .pipe(
            map(() => '200'),  // Em caso de sucesso, retorna "OK"
            catchError((error) => {
              console.error('Ocorreu um erro ao buscar o produto:', error);
              return of(tag); // Em caso de erro, retorna a tag
            })
          )
      );
      return result;
    } catch (error) {
      console.error('Erro na requisição:', error);
      return tag; // Em caso de erro, retorna a tag
    }
  }

  postReadout(readoutDate: string, tags: string[]): Observable<any> {
    const body = {
      readoutDate: readoutDate,
      tags: tags
    };

    return this.http.post(`${this.apiUrl}/Readout`, body);
  }
}
