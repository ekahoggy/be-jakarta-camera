import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EdukasiRoutingModule } from './edukasi-routing.module';
import { KategoriComponent } from './kategori/kategori.component';
import { OrderComponent } from './order/order.component';
import { ListComponent } from './list/list.component';
import { SliderComponent } from './slider/slider.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    KategoriComponent,
    OrderComponent,
    ListComponent,
    SliderComponent
  ],
  imports: [
    CommonModule,
    EdukasiRoutingModule,
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
export class EdukasiModule { }
