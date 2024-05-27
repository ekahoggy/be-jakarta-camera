import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { MasterRoutingModule } from './master-routing.module';
import { ProductComponent } from './product/product.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { PromoComponent } from './promo/promo.component';
import { RoleComponent } from './role/role.component';
import { VoucherComponent } from './voucher/voucher.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    ProductComponent,
    ProductCategoryComponent,
    PromoComponent,
    RoleComponent,
    VoucherComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DragDropModule,
    CKEditorModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class MasterModule { }
