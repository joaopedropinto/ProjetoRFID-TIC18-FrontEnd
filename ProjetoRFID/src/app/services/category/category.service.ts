import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

   getCategories(): Observable<Category[]> {
     return this.http.get<Category[]>(`${this.apiUrl}/Category`);
   }
}
