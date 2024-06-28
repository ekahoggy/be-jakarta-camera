import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalRoutingModule } from './modal-routing.module';
import { ResiComponent } from './resi/resi.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ResiComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule,
    ModalRoutingModule
  ]
})
export class ModalModule { }
