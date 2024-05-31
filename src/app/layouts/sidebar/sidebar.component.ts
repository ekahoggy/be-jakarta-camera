import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menu: any = {};
  counterPesanan: number = 0;

  constructor(
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.counted();
  }

  counted(){
    this.globalService.DataGet("/dashboard/counterPesanan", {}, false).subscribe((res: any) => {
      this.counterPesanan = res.data.total_konfirmasi;
    }, (error: any) => {
      this.counterPesanan = 0;
    })
  }

  openMenu(id:string) {
    let menu = document.getElementById(id);
    let open = menu?.classList.contains('open');

    if (!!open) {
      menu?.classList.remove("open");
    }

    if (!open) {
      menu?.classList.add("menu-item-animating");
      menu?.classList.add("open");

      setTimeout(function() {
        menu?.classList.remove("menu-item-animating");
      }, 500);
    }
  }
}
