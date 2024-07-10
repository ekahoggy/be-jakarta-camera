import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';

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
  listCategory: any;
  selectedProduk: any = [];

  listEdukasi: any = [];
  listCategoryEdukasi: any;
  selectedEdukasi: any = [];

  model: any = {};
  modelParam: any = {};
  modelDetail: any = {};
  isLoading: boolean = false;
  addFromKategori: boolean = false;

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
    this.model.type = 'produk'
    this.getProduk();
    this.getListCategory();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.getDataById(val.id);
    this.getProduk();
    this.getListCategory();
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getDataById(val.id);
    this.getProduk();
    this.getListCategory();
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/promo/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data
      this.selectedProduk = res.data.detail;
      this.isLoading = false;
    })
  }

  getListCategory() {
    this.globalService.DataGet('/kategori', {}, false).subscribe((res: any) => {
      this.listCategory = res.data.list;
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

  getProdukByKategori() {
    this.selectedProduk = [];
    this.listProduk = [];
    this.addFromKategori = false;
    this.globalService.DataGet(`/produk/byKategori/`+this.model.kategori_id, false).subscribe((res: any) => {
      this.listProduk = res.data;
      let data = res.data;
      this.addFromKategori = true;

      data.forEach(item => {
        let row = {
          m_produk_id: item.id,
          nama: item.nama,
          harga: item.harga,
          qty: 1,
          promo_used: "-",
          nominal: 0,
          persen: 0,
          status: true
        }

        this.selectedProduk.push(row);
      });
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
  }

  addProduk() {
    this.getProduk();
    let row = {
      m_produk_id: "",
      nama: "",
      harga: 0,
      qty: 1,
      promo_used: "-",
      nominal: 0,
      persen: 0,
      status: false
    }
    this.selectedProduk.push(row);
  }

  removeProduk(i) {
    this.selectedProduk.splice(i, 1);
  }

  hitungDiskon(item){
    let diskon = 0;

    diskon = (item.nominal/item.harga) * 100;
    item.persen = diskon;
  }

  hitungHarga(item){
    let diskon = 0;

    diskon = (item.persen / 100) * item.harga;
    item.nominal = diskon;
  }

  changeStatusProduk(e, i) {
    this.selectedProduk[i].status = e.currentTarget.checked;
  }

  changeType(){
    if(this.model.type === 'edukasi'){
      this.model.is_flashsale = 0;

    }
  }
}
