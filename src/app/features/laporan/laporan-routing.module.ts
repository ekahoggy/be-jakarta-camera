import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { StokComponent } from './stok/stok.component';

const routes: Routes = [
  {
    path: 'order',
    component: OrderComponent,
  },
  {
    path: 'stok',
    component: StokComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaporanRoutingModule { }
