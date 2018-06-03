import { TestHelper } from '../../shared/testing/test.helper';
import { Observable } from 'rxjs';

export class FakeEditorService {
  public generate(
    text: string,
    params: string = ''
  ): Observable<any> {
    return TestHelper.noResponse();
  }

  public getValidParams() {
    return TestHelper.noResponse();
  }

  public getLocalDoc(docname: string) {
    return TestHelper.noResponse();
  }
}
