import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
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
    public activeModal: NgbActiveModal,
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
          filter: JSON.stringify({}),
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
    this.getDataById(item.id);
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
    this.globalService.DataGet('/salesorder/detail_order_voucher', params).subscribe((res: any) => {
      if (res.status_code === 200) {
        this.detailResi = res.data;
        this.detailResi.forEach((val, key) => {
          this.qtyPaketResi += val.product_qty;
          this.beratPaketResi += val.item_weight;
          this.asuransiPaket = val.total_insurance;
          if (key < 5) {
            this.isiPaketResi += val.product_name + ', ';
          }
        });
        this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
      }
    });
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

}
