import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,  Subscription } from 'rxjs';
import { ApiConfig } from '../../api.config';

@Injectable()
export class EditorService {

  constructor(private http: HttpClient) {}

  /**
   * Generate a PDF.
   *
   * @param      {string}  text    The text
   * @param      {string}  params  The parameters
   * @return     {Observable}  Handler for request.
   */
  public generate(options = {}): Observable<any> {
    return this.http.post(
      ApiConfig.API_URL + '/convert', JSON.stringify(options), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Get a list of valid CLI parameters.
   *
   * @return     {Observable}  Handler for request.
   */
  public getValidParams(): Observable<any> {
    return this.http.get(
      ApiConfig.API_URL + '/convert/params', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  /**
   * Get a json document from assets directory.
   *
   * @param      {string}  docname  The name of the document
   * @return     {Observable}  Handler for request.
   */
  public getLocalDoc(docname: string) {
    return this.http.get(
      '/assets/docs/' + docname + '.json', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }
}
