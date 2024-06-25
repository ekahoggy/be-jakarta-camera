import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daftar',
  templateUrl: './daftar.component.html',
  styleUrls: ['./daftar.component.scss']
})
export class DaftarComponent implements OnInit {

  isActive: string;

  ngOnInit(): void {
    this.isActive = 'seo';
    this.getMenu();
  }

  changeMenu(menu: string) {
    this.isActive = menu;
    localStorage.setItem('MENU_SETTING', menu);
  }

  getMenu() {
    const menu = localStorage.getItem('MENU_SETTING');
    if (menu) {
      this.isActive = menu;
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('MENU_SETTING');
  }

}
