import { Injectable, Inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditorComponent } from './editor.component';

@Injectable()
export class EditorRouteGuard implements CanDeactivate<EditorComponent> {
  canDeactivate(component: EditorComponent) {
    if (component.hasChanges()) {
      return window.confirm('Your text will be lost. Continue?');
    }
    return true;
  }
}
