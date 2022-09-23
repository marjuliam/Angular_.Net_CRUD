import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private myAppURL = 'https://localhost:7118';
  private myApiURL = '/api/Tarjeta/';

  constructor(private http: HttpClient) { }

  getListTarjetas(): Observable<any> {
    return this.http.get(this.myAppURL + this.myApiURL); 
  }

  saveTarjeta(tarjeta: any): Observable<any> {
    return this.http.post(this.myAppURL + this.myApiURL, tarjeta); 
  }

  updateTarjeta(id:number, tarjeta: any): Observable<any> {
    return this.http.put(this.myAppURL + this.myApiURL + id, tarjeta); 
  }

  deleteTarjeta(id: number): Observable<any> {
    return this.http.delete(this.myAppURL + this.myApiURL + id); 
  }
}
