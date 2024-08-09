import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
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
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  user: any = {}
  pendapatanBulanIni: any = [];
  pendapatanHariIni: any = [];

  constructor(
    private globalService: GlobalService,
  ) {
    this.chartOptions = {
      series: [
        {
          name: "Pendapatan",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 100, 100, 100]
        }
      ],
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
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      }
    };
  }

  ngOnInit(): void {
    this.user = this.globalService.getAuth().user;
    this.getPendapatanBulanIni();
    this.getPendapatanHariIni();
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
}
