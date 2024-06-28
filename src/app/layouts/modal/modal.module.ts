import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalRoutingModule } from './modal-routing.module';
import { ResiComponent } from './resi/resi.component';


@NgModule({
  declarations: [
    ResiComponent
  ],
  imports: [
    CommonModule,
    ModalRoutingModule
  ]
})
export class ModalModule { }
