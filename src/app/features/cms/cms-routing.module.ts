import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SliderComponent } from './slider/slider.component';
import { SettingComponent } from './setting/setting.component';
import { PromoSliderComponent } from './promo-slider/promo-slider.component';
import { DaftarComponent } from './daftar/daftar.component';

const routes: Routes = [
  {
    path: 'slider',
    component: SliderComponent,
  },
  {
    path: 'promo-slider',
    component: PromoSliderComponent,
  },
  {
    path: 'setting',
    component: SettingComponent,
  },
  {
    path: 'daftar',
    component: DaftarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
