import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EditorComponent } from './editor.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    EditorComponent
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
