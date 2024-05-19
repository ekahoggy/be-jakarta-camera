import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menu: any = {};

  ngOnInit(): void {
    
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
