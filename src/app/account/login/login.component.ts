import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.empty();
  }

  empty() {
    this.model = {};
  }

  login() {
    let session = {};
    this.loading = true;
    localStorage.removeItem('session');
    localStorage.removeItem('token');
    this.globalService.DataPost('/auth/login', this.model, false).subscribe((res: any) => {
      if (res) {
        session = {
          user: res.data.user,
          token: res.data.auth
        }
        let bt = btoa(JSON.stringify(session));
        console.log(res)

        localStorage.setItem('session', bt);
        localStorage.setItem('token', res.data.auth.original.access_token);
        window.location.reload();
        this.router.navigate(['dashboard']);
      }
      else {
        Swal.fire({
          title: 'Perhatian',
          text: 'Login gagal, email dan password tidak sama',
          icon: 'error'
        })
      }
      this.loading = false;
    },
      err => {
        Swal.fire({
          title: 'Perhatian',
          text: 'Login gagal, email dan password tidak sama',
          icon: 'error'
        })
        this.loading = false;
      });
  }
}
