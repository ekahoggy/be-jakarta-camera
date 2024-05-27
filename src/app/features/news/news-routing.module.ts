import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeritaComponent } from './berita/berita.component';

const routes: Routes = [
  {
    path: '',
    component: BeritaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
