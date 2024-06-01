import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss']
})
export class PromoComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  listProduk: any = [];
  selectedProduk: any = [];
  model: any = {};
  modelParam: any = {};
  modelDetail: any = {};
  isLoading: boolean = false;

  maxDate?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  invalidDates: dayjs.Dayjs[] = [];

  constructor(
    private globalService: GlobalService,
  ) { }


  ngOnInit(): void {
    this.modelParam.is_status = '1';
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
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.globalService.DataGet("/promo", params, false).subscribe((res: any) => {
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

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  reset() {
    this.modelParam = {
      kode: '',
      is_status: '1'
    }

    this.reloadDataTable()
  }

  empty() {
    this.model = {};
    this.modelDetail = {};
    this.listProduk = [];
    this.selectedProduk = [];
  }

  index() {
    this.showForm = !this.showForm;
  }

  create() {
    this.showForm = !this.showForm;
    this.empty()
    this.isEdit = false;
    this.isView = false;
    this.model.is_flashsale = 0
    this.getProduk();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.getDataById(val.id);
    this.getProduk();
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getDataById(val.id);
    this.getProduk();
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/promo/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data
      this.selectedProduk = res.data.detail;
      this.isLoading = false;
    })
  }

  save() {
    let data = {
      main: this.model,
      detail: this.selectedProduk
    };
    const final = Object.assign(data)
    this.globalService.DataPost('/promo/save', final).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Promo saved successfully')
        this.index();
      }
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
        v.nama = e.nama;
        v.harga = e.harga;
      }
      if (v.id === e.id) {
        console.log("sama");
        // this.globalService.alertError('Gagal', 'Produk sudah ada di dalam daftar promo');
      }
    });
    console.log(this.selectedProduk)
  }

  addProduk() {
    let row = {
      m_produk_id: "",
      nama: "",
      harga: 0,
      qty: 1,
      promo_used: "-",
      persen: 0
    }
    this.selectedProduk.push(row);
  }

  removeProduk(i) {
    this.selectedProduk.splice(i, 1);
  }
}
