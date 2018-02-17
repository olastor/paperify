import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { ApiConfig } from '../../api.config';

@Injectable()
export class EditorService {

  url: string = ApiConfig.url;

  constructor(private http: Http) {}

  /**
   * Generate a PDF.
   *
   * @param      {string}  text    The text
   * @param      {string}  params  The parameters
   * @return     {Observable}  Handler for request.
   */
  public generate(
    text: string,
    params: string = ''
  ): Observable<any> {
    return this.http.post(
      this.url + '/api/generate', JSON.stringify({
        text, params
      }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Get a list of valid CLI parameters.
   *
   * @return     {Observable}  Handler for request.
   */
  public getValidParams() {
    return this.http.get(
      this.url + '/api/list/params', {
        headers: new Headers({
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
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      }
    );
  }
}
