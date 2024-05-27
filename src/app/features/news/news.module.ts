import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { KategoriComponent } from './kategori/kategori.component';
import { BeritaComponent } from './berita/berita.component';


@NgModule({
  declarations: [
    KategoriComponent,
    BeritaComponent
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DragDropModule,
    CKEditorModule,
  ]
})
export class NewsModule { }
