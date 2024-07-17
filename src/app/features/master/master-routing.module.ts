import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { PromoComponent } from './promo/promo.component';
import { RoleComponent } from './role/role.component';
import { VoucherComponent } from './voucher/voucher.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full'
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'product',
    component: ProductComponent,
  },
  {
    path: 'product-category',
    component: ProductCategoryComponent,
  },
  {
    path: 'promo',
    component: PromoComponent,
  },
  {
    path: 'voucher',
    component: VoucherComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
