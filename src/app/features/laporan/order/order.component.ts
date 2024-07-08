import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  model: any = {};
  modelParam: any = {};
  listCategory: any = [];
  isLoading: boolean = false;
  total: number = 0;

  constructor(
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.globalService.DataGet("/laporan/penjualan", {}, false).subscribe((res: any) => {
      this.listData = res.data;
      this.total = res.data.total;
    })
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  reset(){

  }

}
