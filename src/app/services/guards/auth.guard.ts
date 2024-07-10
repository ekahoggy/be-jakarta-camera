import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { GlobalService } from '../global.service';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private globalService: GlobalService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Check user session
    const user = this.globalService.getAuth();
    if (user === null) {
      this.router.navigate(['account/login']);
      return false;
    }

    // Check token expired
    this.globalService.DataGet('/auth/checkAuthorization', {}, false).subscribe((res: any) => {
      console.log(res);
    }, (error: any) => {
      console.log(error);
      if (error.status === 401) {
        Swal.fire({
          icon: "warning",
          title: 'Your login session has ended',
          text: "Please log in again",
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Login",
        }).then((result) => {
          console.log(result);
          this.router.navigate(['account/login']);
          this.globalService.destroyAuth();
          return false;
        });
      }
    })

    return true;
  }
}
