import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from 'src/app/services/global.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-masuk',
  templateUrl: './masuk.component.html',
  styleUrls: ['./masuk.component.scss']
})
export class MasukComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  listProduk: any = [];
  listKategori : any = [];
  selectedProduk: any = [];
  model: any = {};
  isLoading: boolean = false;

  constructor(
    private globalService: GlobalService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.empty();
    this.getData();
  }

  getData() {
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      searching: false,
      lengthChange: false,
      pagingType: "simple_numbers",
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify({}),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.globalService.DataGet("/stok/masuk", params, false).subscribe((res: any) => {
          this.listData = res.data.list;

          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        }, (error: any) => {
          this.listData = [];
        })
      },
    };
  }

  empty() {
    this.model = {};
    this.listProduk = [];
    this.listKategori = [];
    this.selectedProduk = [];
  }

  index() {
    this.showForm = !this.showForm;
  }

  create() {
    this.empty()
    this.showForm = !this.showForm;
    let today = moment().format('Y/MM/D');
    this.model.tanggal = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.model.type = 'i';
    this.isEdit = false;
    this.isView = false;
    this.getProduk();
    this.getKategori();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.getDataById(val.id);
    this.getProduk();
    this.getKategori();
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getDataById(val.id);
    this.getProduk();
    this.getKategori();
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/stok/masuk/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data;
      this.selectedProduk = res.data.detail;
      this.isLoading = false;
    })
  }

  save(status = 'd') {
    this.model.status = status;
    delete this.model.detail;
    let data = {
      main: this.model,
      detail: this.selectedProduk
    };
    const final = Object.assign(data)
    this.globalService.DataPost('/stok/masuk/save', final).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Stok Masuk saved successfully')
        this.index();
      }
    })
  }

  getKategori() {
    this.globalService.DataGet(`/stok/kategori/type/i`, {}, false).subscribe((res: any) => {
      this.listKategori = res.data;
    })
  }

  getProduk() {
    this.globalService.DataGet(`/produk`, {}, false).subscribe((res: any) => {
      this.listProduk = res.data.list;
    })
  }

  changeProduk(e, i) {
    this.selectedProduk.forEach((v, k) => {
      if (i === k) {
        let paramsStok = {
          'type': 'i',
          'm_produk_id': v.m_produk_id
        };
        this.globalService.DataGet(`/stok/available`, paramsStok, false).subscribe((res: any) => {
          v.sisa = res.data;
        })
      }
      if (v.id === e.id) {
        console.log("sama");
        // this.globalService.alertError('Gagal', 'Produk sudah ada di dalam daftar promo');
      }
    });
  }

  addProduk() {
    let row = {
      m_produk_id: "",
      nama: "",
      qty: 1,
      sisa: 0
    }
    this.selectedProduk.push(row);
  }

  removeProduk(i) {
    this.selectedProduk.splice(i, 1);
  }
}
