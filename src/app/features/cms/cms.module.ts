import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsRoutingModule } from './cms-routing.module';
import { SliderComponent } from './slider/slider.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgOptionHighlightModule } from '@ng-select/ng-option-highlight';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SettingComponent } from './setting/setting.component';
import { PromoSliderComponent } from './promo-slider/promo-slider.component';
import { DaftarComponent } from './daftar/daftar.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    SliderComponent,
    SettingComponent,
    PromoSliderComponent,
    DaftarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    CmsRoutingModule,
    DataTablesModule,
    FormsModule,
    NgSelectModule,
    NgOptionHighlightModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DragDropModule
  ]
})
export class CmsModule { }
