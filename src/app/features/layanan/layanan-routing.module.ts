import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceComponent } from './service/service.component';
import { CctvComponent } from './cctv/cctv.component';

const routes: Routes = [
  {
    path: 'service',
    component: ServiceComponent,
  },
  {
    path: 'cctv',
    component: CctvComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayananRoutingModule { }
