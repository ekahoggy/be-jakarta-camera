import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any = {}

  constructor(
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    this.user = this.globalService.getAuth().user;
  }

  logout() {
    // let token = this.globalService.getToken();
    // console.log(token);
    Swal.fire({
      icon: "question",
      title: 'Apakah anda yakin?',
      text: "Ingin keluar dari halaman admin?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Keluar",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if(result.isConfirmed) {
        this.globalService.DataPost('/auth/logout').subscribe((res:any) => {
          if(res.status_code === 200) {
            this.globalService.destroyAuth().then(() => {});
          }
          else{
            this.globalService.alertError('Gagal', 'Error Get Authentication');
          }
        });
      }
    });
  }
}
