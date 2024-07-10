import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  user: any = {}
  pendapatanBulanIni: any = [];
  pendapatanHariIni: any = [];

  constructor(
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.user = this.globalService.getAuth().user;
    this.getPendapatanBulanIni();
    this.getPendapatanHariIni();
  }

  empty(){
    this.pendapatanBulanIni = [];
    this.pendapatanHariIni = [];
  }

  getPendapatanBulanIni(){
    this.globalService.DataGet("/dashboard/pendapatan", {}, false).subscribe((res: any) => {
      this.pendapatanBulanIni = res.data;
    }, (error: any) => {
      this.pendapatanBulanIni = [];
    })
  }

  getPendapatanHariIni(){
    this.globalService.DataGet("/dashboard/penjualanhariini", {}, false).subscribe((res: any) => {
      this.pendapatanHariIni = res.data;
    }, (error: any) => {
      this.pendapatanHariIni = [];
    })
  }
}
