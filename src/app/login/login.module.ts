import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule { }
