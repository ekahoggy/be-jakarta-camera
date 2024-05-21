import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StokRoutingModule } from './stok-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MasukComponent } from './masuk/masuk.component';
import { KeluarComponent } from './keluar/keluar.component';
import { OpnameComponent } from './opname/opname.component';
import { KategoriComponent } from './kategori/kategori.component';


@NgModule({
  declarations: [
    MasukComponent,
    KeluarComponent,
    OpnameComponent,
    KategoriComponent
  ],
  imports: [
    CommonModule,
    StokRoutingModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgxMaskDirective,
    NgxMaskPipe
  ]
})
export class StokModule { }
