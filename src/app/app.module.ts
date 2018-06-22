import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ROUTES } from './app.routes';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { ConverterService } from './converter/converter.service';
import { NotFoundComponent } from './notfound/notfound.component';
import { ConverterComponent } from './converter/converter.component';
import { PrivacyComponent } from './privacy/privacy.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ConverterComponent,
    PrivacyComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ConverterService,
    // remove '#' from links
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
