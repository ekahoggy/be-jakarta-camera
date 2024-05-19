import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth.guard';
import { LayoutsComponent } from './layouts/layouts.component';
import { loginGuard } from './services/guards/login.guard';
import { LoginComponent } from './account/login/login.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutsComponent,
    loadChildren: () => import('./features/features.module').then((m) => m.FeaturesModule),
  },
  {
    path: 'account',
    canActivate: [loginGuard],
    component: LoginComponent,
    loadChildren: () => import('./account/account.module').then((m) => m.AccountModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
