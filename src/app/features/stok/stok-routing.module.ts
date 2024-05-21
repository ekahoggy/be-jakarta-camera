import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasukComponent } from './masuk/masuk.component';
import { KeluarComponent } from './keluar/keluar.component';
import { OpnameComponent } from './opname/opname.component';
import { KategoriComponent } from './kategori/kategori.component';

const routes: Routes = [
  {
    path: 'kategori',
    component: KategoriComponent,
  },
  {
    path: 'masuk',
    component: MasukComponent,
  },
  {
    path: 'keluar',
    component: KeluarComponent,
  },
  {
    path: 'opname',
    component: OpnameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StokRoutingModule { }
