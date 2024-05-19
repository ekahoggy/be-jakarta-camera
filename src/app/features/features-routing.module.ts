import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './auth/admin/admin.component';
import { ProductComponent } from './master/product/product.component';
import { StokModule } from './stok/stok.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'users',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'masters',
    loadChildren: () => import('./master/master.module').then((m) => m.MasterModule),
  },
  {
    path: 'stok',
    loadChildren: () => import('./stok/stok.module').then((m) => m.StokModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
