import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  Subscription } from 'rxjs';
import { ApiConfig } from '../../api.config';

@Injectable()
export class ConverterService {

  constructor(private http: HttpClient) {}

  public convert(text: string, from: string, to: string): Observable<any> {
    return this.http.post(
      ApiConfig.API_URL + '/convert', JSON.stringify({ text, from, to }), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
