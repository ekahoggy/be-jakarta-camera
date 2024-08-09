import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayananRoutingModule } from './layanan-routing.module';
import { ServiceComponent } from './service/service.component';
import { CctvComponent } from './cctv/cctv.component';
import { FormsModule } from '@angular/forms';
import { AngularMyDatePickerModule } from '@nodro7/angular-mydatepicker';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    ServiceComponent,
    CctvComponent
  ],
  imports: [
    CommonModule,
    LayananRoutingModule,
    FormsModule,
    AngularMyDatePickerModule,
    DataTablesModule,
    NgApexchartsModule
  ]
})
export class LayananModule { }
