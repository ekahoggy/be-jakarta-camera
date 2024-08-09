import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderComponent } from './order/order.component';
import { EdukasiModule } from './edukasi/edukasi.module';
import { LayananModule } from './layanan/layanan.module';

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
    path: 'order',
    component: OrderComponent,
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
  },
  {
    path: 'frontend',
    loadChildren: () => import('./cms/cms.module').then((m) => m.CmsModule),
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then((m) => m.NewsModule),
  },
  {
    path: 'edukasi',
    loadChildren: () => import('./edukasi/edukasi.module').then((m) => m.EdukasiModule),
  },
  {
    path: 'layanan',
    loadChildren: () => import('./layanan/layanan.module').then((m) => LayananModule),
  },
  {
    path: 'laporan',
    loadChildren: () => import('./laporan/laporan.module').then((m) => m.LaporanModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
