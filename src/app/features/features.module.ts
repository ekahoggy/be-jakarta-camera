import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FeaturesRoutingModule } from './features-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { OrderComponent } from './order/order.component';
import { DragDropModule } from "@angular/cdk/drag-drop";


@NgModule({
  declarations: [
    DashboardComponent,
    OrderComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule,
    DataTablesModule
  ]
})
export class FeaturesModule { }
