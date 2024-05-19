import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AdminComponent } from './admin/admin.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './customer/customer.component';
import { CustomerAddressComponent } from './customer-address/customer-address.component';


@NgModule({
  declarations: [
    AdminComponent,
    CustomerComponent,
    CustomerAddressComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DataTablesModule,
    FormsModule
  ]
})
export class AuthModule { }
