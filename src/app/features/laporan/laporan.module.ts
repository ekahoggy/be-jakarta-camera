import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaporanRoutingModule } from './laporan-routing.module';
import { OrderComponent } from './order/order.component';
import { StokComponent } from './stok/stok.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    OrderComponent,
    StokComponent
  ],
  imports: [
    CommonModule,
    LaporanRoutingModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DragDropModule,
    EditorModule
  ]
})
export class LaporanModule { }
