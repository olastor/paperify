import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ApiConfig } from '../../api.config';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient) {}

  public login(username: string, password: string): Observable<any> {
    return this.http.post(ApiConfig.url + '/auth/login', {
      username, password
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  public signup(
    username: string,
    password: string
  ): Observable<any> {
    return this.http.post(ApiConfig.url + '/auth/signup', {
      username, password
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
