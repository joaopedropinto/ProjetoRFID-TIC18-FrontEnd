import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Packaging } from '../../models/packaging.model';

@Injectable({
  providedIn: 'root'
})
export class PackagingService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  postPackaging(packaging: Packaging): Observable<Packaging> {
    return this.http.post<Packaging>(`${this.apiUrl}/Packaging`, packaging);
  }
}
