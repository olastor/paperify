import { Observable } from 'rxjs/Observable';
import { ComponentFixture, tick } from '@angular/core/testing';

export class TestHelper {
  public static noResponse() {
    return Observable.create(() => {
    });
  }
}
