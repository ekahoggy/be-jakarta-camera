import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { DataTableDirective } from 'angular-datatables';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  user: any = {}
  userLog: any = [];
  pendapatanBulanIni: any = [];
  pendapatanHariIni: any = [];
  dashboardOrder: any = [];
  reminderStok: any = [];
  xaxisx = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  seriesx = [
    {
      name: "Pendapatan per Bulan",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]

  constructor(
    private globalService: GlobalService,
  ) {
    this.chartOptions = {};
  }

  ngOnInit(): void {
    this.user = this.globalService.getAuth().user;
    this.getPendapatanBulanIni();
    this.getPendapatanHariIni();
    this.getDashboardOrder();
    this.getUserLog();
    this.getReminderStok();
  }

  empty() {
    this.pendapatanBulanIni = [];
    this.pendapatanHariIni = [];
  }

  getPendapatanBulanIni() {
    this.globalService.DataGet("/dashboard/pendapatan", {}, false).subscribe((res: any) => {
      this.pendapatanBulanIni = res.data;
    }, (error: any) => {
      this.pendapatanBulanIni = [];
    })
  }

  getPendapatanHariIni() {
    this.globalService.DataGet("/dashboard/penjualanhariini", {}, false).subscribe((res: any) => {
      this.pendapatanHariIni = res.data;
    }, (error: any) => {
      this.pendapatanHariIni = [];
    })
  }

  getUserLog() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      lengthChange: false,
      pagingType: "simple_numbers",
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: '',
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.globalService.DataGet("/dashboard/logUser", params, false).subscribe((res: any) => {
          this.userLog = res.data.list;
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        }, (error: any) => {
          this.userLog = [];
        })
      },
    };
  }

  getReminderStok() {
    this.globalService.DataGet("/dashboard/reminderStok", {}, false).subscribe((res: any) => {
      this.reminderStok = res.data;
    }, (error: any) => {
      this.reminderStok = [];
    })
  }

  getDashboardOrder() {
    this.globalService.DataGet("/dashboard/penjualanpertahun", {}, false).subscribe((res: any) => {
      this.dashboardOrder = res.data;
      this.xaxisx.categories = this.dashboardOrder.months;
      this.seriesx[0].data = this.dashboardOrder.sales;
      this.chartOptions = {
        series:
          this.seriesx
        ,
        chart: {
          height: 350,
          width: 880,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Penjualan Tahun Ini",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: this.xaxisx
      };

      this.chartOptions.title.text = "Penjualan per Tahun";

    }, (error: any) => {
      this.dashboardOrder = [];
    })
  }
}
