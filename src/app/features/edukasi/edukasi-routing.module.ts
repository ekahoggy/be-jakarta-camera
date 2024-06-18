import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { KategoriComponent } from './kategori/kategori.component';
import { OrderComponent } from './order/order.component';
import { SliderComponent } from './slider/slider.component';

const routes: Routes = [
  {
    path: 'daftar',
    component: ListComponent,
  },
  {
    path: 'kategori',
    component: KategoriComponent,
  },
  {
    path: 'order',
    component: OrderComponent,
  },
  {
    path: 'slider',
    component: SliderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EdukasiRoutingModule { }
