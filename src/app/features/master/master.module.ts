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
    FormsModule
  ]
})
export class MasterModule { }
