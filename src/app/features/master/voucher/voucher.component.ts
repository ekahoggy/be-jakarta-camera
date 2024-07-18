import { Component, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  listUser: any = [];
  modelParam: any = {};
  model: any = {};
  base64Image: string | null = null;
  isLoading: boolean = false;

  listProduk: any = [];
  listCategory: any;
  listBrand: any;
  selectedProduk: any = [];

  listEdukasi: any = [];
  listCategoryEdukasi: any;
  selectedEdukasi: any = [];

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
        this.globalService.DataGet("/voucher", params, false).subscribe((res: any) => {
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
    this.model.gambar = "assets/img/elements/18.jpg";
  }

  index() {
    this.showForm = !this.showForm;
    this.empty();
  }

  create() {
    this.showForm = !this.showForm;
    this.model.kategori = 'T'
    this.model.type = 'P'
    this.model.untuk = 'umum'
    this.model.for_co = 'kategori'
    this.model.used_to = 'produk'
    this.model.voucher_value = 0
    this.model.is_hidden = 0
    this.model.kategori_id = [];
    this.model.brand_id = [];
    this.model.user_id = [];
    this.isEdit = false;
    this.isView = false;
    this.getUser()

    this.getListCategoryProduk();
    this.getListBrandProduk();
    this.getListCategoryEdukasi();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.getDataById(val.id)
    this.getUser()
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getDataById(val.id)
    this.getUser()
  }

  getUser() {
    this.globalService.DataGet('/customer', {}, false).subscribe((res: any) => {
      this.listUser = res.data.list;
    })
  }

  save() {
    this.model.gambar = this.setImageBase64(this.model.gambar);
    let data = {
      main: this.model,
      detail: this.selectedProduk
    };
    const final = Object.assign(data)
    this.globalService.DataPost('/voucher/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Voucher saved successfully')
        this.index();
      }
    })
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/voucher/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data
      this.model.gambar = this.globalService.getImage('voucher', this.model.gambar)
      this.selectedProduk = res.data.detail;

      if(this.model.jenis == 'brand'){
        this.listBrand = res.data.voucher_kategori;
        this.listBrand.forEach(val => {
          val.id = val.brand_id;
        });
      }
      else{
        this.listCategory = res.data.voucher_kategori;
        this.listCategory.forEach(val => {
          val.id = val.kategori_id;
        });
      }
      this.isLoading = false;
    })
  }

  getEdukasiByKategori() {
    this.selectedProduk = [];
    this.listProduk = [];
    this.listEdukasi = [];
    this.globalService.DataPost(`/edukasi/byKategori`, this.model.kategori_id).subscribe((res: any) => {
      this.listProduk = res.data;
      let data = res.data;

      data.forEach(item => {
        let row = {
          m_edukasi_id: item.id,
          nama: item.judul,
          harga: item.harga,
          kategori: item.kategori_edukasi,
          kategori_id: item.kategori_id,
          qty: item.stok < 1 ? 0 : 1,
          promo_used: "-",
          nominal: 0,
          persen: 0,
          status: item.stok < 1 ? false : true,
          disabled: item.stok < 1 ? true : false
        }

        this.selectedProduk.push(row);
      });
    })
  }

  getProdukByKategori() {
    this.selectedProduk = [];
    this.listProduk = [];
    this.listEdukasi = [];

    this.globalService.DataPost(`/produk/byKategori`, this.model.kategori_id).subscribe((res: any) => {
      this.listProduk = res.data;
      let data = res.data;


      data.forEach(item => {
        let row = {
          m_produk_id: item.id,
          nama: item.nama,
          harga: item.harga,
          kategori: item.kategori_produk,
          kategori_id: item.m_kategori_id,
          brand: item.brand_produk,
          brand_id: item.m_brand_id,
          qty: item.stok < 1 ? 0 : 1,
          stok: item.stok,
          promo_used: "-",
          nominal: 0,
          persen: 0,
          status: item.stok < 1 ? false : true,
          disabled: item.stok < 1 ? true : false
        }

        this.selectedProduk.push(row);
      });
    })
  }

  getProdukByBrand() {
    this.selectedProduk = [];
    this.listProduk = [];
    this.listEdukasi = [];

    this.globalService.DataPost(`/produk/byBrand`, this.model.brand_id).subscribe((res: any) => {
      this.listProduk = res.data;
      let data = res.data;


      data.forEach(item => {
        let row = {
          m_produk_id: item.id,
          nama: item.nama,
          harga: item.harga,
          kategori: item.kategori_produk,
          kategori_id: item.m_kategori_id,
          brand: item.brand_produk,
          brand_id: item.m_brand_id,
          qty: item.stok < 1 ? 0 : 1,
          stok: item.stok,
          promo_used: "-",
          nominal: 0,
          persen: 0,
          status: item.stok < 1 ? false : true,
          disabled: item.stok < 1 ? true : false
        }

        this.selectedProduk.push(row);
      });
    })
  }

  getListCategoryProduk() {
    this.globalService.DataGet('/kategori', {}, false).subscribe((res: any) => {
      this.listCategory = res.data.list;
    })
  }

  getListBrandProduk() {
    this.globalService.DataGet('/brand', {}, false).subscribe((res: any) => {
      this.listBrand = res.data.list;
    })
  }

  getListCategoryEdukasi() {
    this.globalService.DataGet('/edukasi/kategori', {}, false).subscribe((res: any) => {
      this.listCategoryEdukasi = res.data.list;
    })
  }

  onFileSelected(event: any) {
    const selectedFile = <File>event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.base64Image = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }

  setImageBase64(image) {
    let gambar = image;
    if (this.base64Image) {
      gambar = {
        base64: this.base64Image
      }
    }

    return gambar;
  }

  hitungDiskon(item) {
    let diskon = 0;

    diskon = (item.nominal / item.harga) * 100;
    item.persen = diskon;
  }

  hitungHarga(item) {
    let diskon = 0;

    diskon = (item.persen / 100) * item.harga;
    item.nominal = diskon;
  }

  changeStatusProduk(e, i) {
    this.selectedProduk[i].status = e.currentTarget.checked;
  }

  changeType(){
    this.listProduk = [];
    this.selectedProduk = [];
    this.model.kategori_id = [];
    this.model.brand_id = [];

    if(this.model.used_to === 'edukasi'){
      this.getListCategoryEdukasi()
    }
    else{
      this.getListBrandProduk()
      this.getListCategoryProduk()
    }
  }
}
