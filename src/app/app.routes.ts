import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './notfound/notfound.component';
import { ConverterComponent } from './converter/converter.component';
import { PrivacyComponent } from './privacy/privacy.component';

export const ROUTES: Routes = [
  { path: '', component: ConverterComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', component: NotFoundComponent }
];
