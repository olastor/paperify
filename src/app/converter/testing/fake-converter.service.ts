import { TestHelper } from '../../shared/testing/test.helper';
import { Observable } from 'rxjs';

export class FakeConverterService {
  public convert(
    text: string,
    from: string,
    to: string
  ): Observable<any> {
    return TestHelper.noResponse();
  }
}
