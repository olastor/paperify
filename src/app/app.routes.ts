import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { EditorRouteGuard } from './editor/editor.guard';
import { HelpComponent } from './help/help.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';

export const ROUTES: Routes = [
  { path: '', component: EditorComponent, canDeactivate: [EditorRouteGuard] },
  { path: 'edit/:id', component: EditorComponent, canDeactivate: [EditorRouteGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'help', component: HelpComponent },
  { path: 'quickstart', redirectTo: 's/quickstart' }
];
