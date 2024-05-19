import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { GlobalService } from '../global.service';

@Injectable({ providedIn: 'root' })
export class loginGuard implements CanActivate {
  dataAccResign: any;
  test: any;
  constructor(
    private globalService: GlobalService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.globalService.getAuth();
    
    if (user !== null) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
