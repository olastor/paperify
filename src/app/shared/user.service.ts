import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ApiConfig } from '../../api.config';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  public isLoggedIn(): boolean {
    return typeof localStorage.getItem('token') === 'string';
  }

  public getProfile(): Observable<any> {
    // let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') });
    // let options = new RequestOptions({ headers: headers });

    return this.http.get(
      ApiConfig.url + '/api/user/profile', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public getProject(id: string): Observable<any> {
    return this.http.get(
      ApiConfig.url + '/api/project/' + id, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public getProjects(id: string): Observable<any> {
    return this.http.get(
      ApiConfig.url + '/api/projects', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public createProject(): Observable<any> {
    return this.http.post(ApiConfig.url + '/api/project/new', {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  public updateProject(
    projectId: string,
    content: string,
    options: string,
  ): Observable<any> {
    return this.http.post(ApiConfig.url + '/api/project/update', {
      projectId, content, options
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  public logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('id');

    return this.http.post(ApiConfig.url + '/auth/logout', {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
