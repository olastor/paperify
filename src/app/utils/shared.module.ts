import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [],
  exports: [
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
