import { Injectable, Inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditorComponent } from './editor.component';

@Injectable()
export class EditorRouteGuard implements CanDeactivate<EditorComponent> {
  canDeactivate(component: EditorComponent) {
    if (component.hasUnsavedChanges()) {
      return window.confirm('You have unsaved changes. Continue?');
    }
    return true;
  }
}
