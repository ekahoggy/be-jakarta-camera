import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutsModule } from './layouts/layouts.module';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { AngularTreeGridModule } from "angular-tree-grid";
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    LayoutsModule,
    DataTablesModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AngularTreeGridModule,
    NgProgressModule,
    NgProgressHttpModule,
    NgxSpinnerModule.forRoot({ type: 'ball-atom' }),
  ],
  exports:[
  ],
  providers: [
    provideNgxMask(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
