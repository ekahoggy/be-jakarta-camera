import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LayoutsComponent } from './layouts.component';
import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoaderKontenComponent } from './loader-konten/loader-konten.component';
import { SupportModule } from './support/support.module';
import { ModalModule } from './modal/modal.module';


@NgModule({
  declarations: [
    LayoutsComponent,
    ContentComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SupportModule,
    ModalModule
  ]
})
export class LayoutsModule { }
