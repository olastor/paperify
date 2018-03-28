import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { ROUTES } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { EditorModule } from './editor/editor.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { EditorService } from './editor/editor.service';
import { UserService } from './shared/user.service';
import { HelpComponent } from './help/help.component';
import { EditorRouteGuard } from './editor/editor.guard';
import { ProfileComponent } from './profile/profile.component';

import { ApiConfig } from '../api.config';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    ProfileComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3002', 'paperify.org', 'dev.paperify.org'],
        blacklistedRoutes: ['localhost:3002/auth/', 'paperify.org/auth', 'dev.paperify.org/auth']
      }
    }),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    SharedModule,
    EditorModule,
    LoginModule
  ],
  providers: [
    EditorService,
    EditorRouteGuard,
    UserService,
    // remove '#' from links
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
