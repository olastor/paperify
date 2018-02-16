import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { EditorRouteGuard } from './editor/editor.guard';
import { HelpComponent } from './help/help.component';

export const ROUTES: Routes = [
  { path: '', component: EditorComponent, canDeactivate: [EditorRouteGuard] },
  { path: 's/:id', component: EditorComponent, canDeactivate: [EditorRouteGuard] },
  { path: 'help', component: HelpComponent },
  { path: 'quickstart', redirectTo: 's/quickstart' }
];
