import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { HttpModule } from '@angular/http';

import { ROUTES } from './app.routes';
import { SharedModule } from './utils/shared.module';
import { EditorModule } from './editor/editor.module';
import { AppComponent } from './app.component';
import { EditorService } from './editor/editor.service';
import { HelpComponent } from './help/help.component';
import { EditorRouteGuard } from './editor/editor.guard';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    SharedModule,
    EditorModule
  ],
  providers: [
    EditorService,
    EditorRouteGuard,
    // remove '#' from links
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
