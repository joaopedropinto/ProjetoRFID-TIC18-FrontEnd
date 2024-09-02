import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Readout } from '../../models/readout.model';

@Injectable({
  providedIn: 'root'
})
export class ReadingService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllReadings(): Observable<Readout[]> {
    return this.http.get<Readout[]>(`${this.apiUrl}/Readout`);
  }

  getReadoutById(id: string): Observable<Readout> {
    return this.http.get<Readout>(`${this.apiUrl}/Readout/${id}`);
  }
}
