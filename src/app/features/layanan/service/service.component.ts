import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from 'src/app/services/global.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit{
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  model: any = {};
  modelResi: any = {};
  modelParam: any = {};
  base64Image: string | null = null;
  listCategory: any = [];
  isLoading: boolean = false;
  listDetail: any;
  grandtotal: number = 0;
  multipleResi: boolean = false;
  resi: any = [];
  dataMultiResi: any = [];

  lat: string = "";
  long: string = "";
  alamat: string = '';
  kodepos: string = '';
  email: string = '';
  nohp: string = '';
  newItems: any = [];

  qtyPaketResi = 0;
  beratPaketResi = 0;
  asuransiPaket = 0;
  isiPaketResi = '';
  detailResi = [];

  constructor(
    private globalService: GlobalService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.empty();
    this.getData();
    this.getSetting();
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
        this.globalService.DataGet("/order", params, false).subscribe((res: any) => {
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

  empty() {
    this.model = {};
    this.modelParam.status_order = '';
    this.model.icon = "assets/img/elements/18.jpg";
  }

  index() {
    this.showForm = !this.showForm;
    this.empty();
  }

  create() {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = false;
  }

  edit(val, status) {
    val.status_order = status
    const final = Object.assign(val)
    this.globalService.DataPost('/order/status', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'Status Pesanan Berhasil diubah')
        this.reloadDataTable();
      }
    })
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getDataById(val.id)
  }

  save() {
    this.model.icon = this.setImageBase64(this.model.icon);
    const final = Object.assign(this.model)
    this.globalService.DataPost('/order/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Category saved successfully')
        this.index();
      }
    })
  }

  openModal(modal, item) {
    this.modelResi = item;
    this.modalService.open(modal, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  cetakResi(modal, data) {
    this.modelResi = data;
    let paket = '';
    let params = {
      invoice_number: this.modelResi.invoice_number,
      depot_id: this.modelResi.depot_id
    };
    this.qtyPaketResi = 0;
    this.beratPaketResi = 0;
    this.asuransiPaket = 0;
    this.isiPaketResi = '';
    this.detailResi = [];

    this.modelResi.shipping_group = this.modelResi.shipping_group.replace(/_/g, " ");
    this.modelResi.url_awb = 'https://barcode.tec-it.com/barcode.ashx?data=' + this.modelResi.awb_shipping;
    this.modelResi.url_order = 'https://barcode.tec-it.com/barcode.ashx?data=' + this.modelResi.invoice_number;
    this.globalService.DataGet(`/order/${this.modelResi.id}`, {}, false).subscribe((res: any) => {
      if (res.status_code === 200) {
        this.detailResi = res.data.detail;
        this.detailResi.forEach((val, key) => {
          this.qtyPaketResi += val.qty;
          this.beratPaketResi += val.berat;
          this.asuransiPaket = 0;
          if (key < 5) {
            this.isiPaketResi += val.nama + ', ';
          }
        });
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
      }
    })
  }

  printResi(el) {
    var printContents = document.getElementById(el);
    const newTab = window.open('', '_blank');
    newTab.document.open();
    newTab.document.write(printContents.outerHTML);
    newTab.document.close();
    newTab.addEventListener('load', function () {
      setTimeout(function () {
        newTab.print();
        newTab.close();
      }, 3000); // Waktu tunggu dalam milidetik (5000 ms = 5 detik)
    });
  }

  getSetting() {
    this.globalService.DataGet('/public/setting', { kategori: 'A' }).subscribe((res: any) => {
      res.data.forEach(setting => {
        if (setting.name === 'latitude') {
          this.lat = setting.value;
        }
        if (setting.name === 'longitude') {
          this.long = setting.value;
        }
        if (setting.name === 'kodepos') {
          this.kodepos = setting.value;
        }
        if (setting.name === 'alamat') {
          this.alamat = setting.value;
        }
        if (setting.name === 'no_hp') {
          this.nohp = setting.value;
        }
        if (setting.name === 'email') {
          this.email = setting.value;
        }
      });
    })
  }

  kirim(item) {
    this.globalService.DataGet(`/order/${item.id}`, {}, false).subscribe((respon: any) => {
      this.model = respon.data.data;
      respon.data.detail.forEach((val) => {
        const p = {
          "name": val.nama,
          "description": "",
          "value": val.price,
          "quantity": val.qty,
          "height": val.tinggi,
          "length": val.lebar,
          "weight": val.berat,
          "width": val.panjang
        }

        this.newItems.push(p)
      });

      let params = {
        "shipper_contact_name": "Jakarta Camera",
        "shipper_contact_phone": this.nohp,
        "shipper_contact_email": this.email,
        "shipper_organization": "Jakarta Camera Official Store",
        "origin_contact_name": "Jakarta Camera",
        "origin_contact_phone": this.nohp,
        "origin_address": this.alamat,
        "origin_coordinate": {
          "latitude": this.lat,
          "longitude": this.long
        },
        "origin_note": "",
        "origin_postal_code": this.kodepos,
        "destination_contact_name": item.recipient,
        "destination_contact_phone": item.phone_number,
        "destination_contact_email": item.email,
        "destination_address": item.address,
        "destination_postal_code": item.postal_code,
        "destination_coordinate": {
          "latitude": item.latitude,
          "longitude": item.longitude
        },
        "destination_note": "",
        "courier_company": item.shipping_sender_code,
        "courier_type": item.shipping_service,
        "courier_insurance": 0,
        "delivery_type": "now",
        "order_note": item.note,
        "metadata": {},
        "items": this.newItems
      }

      this.globalService.DataPost('/order/kirim', params).subscribe((res: any) => {
        if (res.status_code == 200) {
          const dataPengiriman = {
            'id': item.id,
            'shipping_id': res.data.id,
            'awb_shipping': res.data.courier.waybill_id,
            'receipt_number': res.data.courier.tracking_id,
            'shipping_url': res.data.courier.link
          }

          this.globalService.DataPost('/order/statusPengiriman', dataPengiriman).subscribe((response: any) => {
            if (response.status_code == 200) {
              this.globalService.alertSuccess('Success', 'Request Pickup')
              this.edit(this.model, 'sent');
            }
          });
        }
      })
    })
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/order/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data.data;
      this.listDetail = res.data.detail;
      this.listDetail.forEach((val) => {
        const p = {
          "name": val.nama,
          "description": "",
          "value": val.price,
          "quantity": val.qty,
          "height": val.tinggi,
          "length": val.lebar,
          "weight": val.berat,
          "width": val.panjang
        }

        this.newItems.push(p)
        this.grandtotal += val.grandtotal_price;
      });

      this.isLoading = false;
    })
  }

  getListCategory(id: string = null) {
    this.globalService.DataGet('/order', { notEqual: id }, false).subscribe((res: any) => {
      this.listCategory = res.data.list;
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
    let icon = image;
    if (this.base64Image) {
      icon = {
        base64: this.base64Image
      }
    }

    return icon;
  }

  reset() {
    this.modelParam = {
      invoice_number: '',
      status_order: ''
    }

    this.reloadDataTable()
  }

  printMulti(modal) {
    const final = Object.assign(this.resi)
    this.globalService.DataPost('/order/multipleGetId', final).subscribe((res: any) => {
      this.dataMultiResi = res.data;
      this.dataMultiResi.forEach(item => {
        item.shipping_group = item.shipping_group.replace(/_/g, " ");
        item.url_awb = 'https://barcode.tec-it.com/barcode.ashx?data=' + item.awb_shipping;
        item.url_order = 'https://barcode.tec-it.com/barcode.ashx?data=' + item.invoice_number;

        item.detail.forEach((val, key) => {
          item.qtyPaketResi += val.qty;
          item.beratPaketResi += val.berat;
          item.asuransiPaket = 0;
          if (key < 5) {
            item.isiPaketResi += val.nama + ', ';
          }
        });
      });
      this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    });
  }

  pushResi(e, item) {
    this.multipleResi = false;
    if (e.target.checked) {
      this.resi.push(item.id);
    }
    else {
      const idToRemove = item.id;
      let ids = this.resi.filter(id => id !== idToRemove);
      this.resi = ids;
    }

    if (this.resi.length > 1) {
      this.multipleResi = true;
    }
  }
}
