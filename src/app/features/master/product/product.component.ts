import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  model: any = {};
  listCategory: any;
  listPhoto: any = [];
  listVariant: any = [];

  constructor(
    private globalService: GlobalService,
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
        this.globalService.DataGet("/produk", params, false).subscribe((res: any) => {
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
    this.listPhoto = [];
    this.listVariant = [];
  }

  index() {
    this.showForm = !this.showForm;
    this.getData();
  }

  create() {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = false;
    this.getListCategory();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.model = val;
    this.getListCategory();
    this.getListPhoto(val.id);
    this.getListVariant(val.id);
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.model = val;
    this.getListCategory();
    this.getListPhoto(val.id);
    this.getListVariant(val.id);
  }

  getListCategory() {
    this.globalService.DataGet('/kategori', {}, false).subscribe((res: any) => {
      this.listCategory = res.data.list;
    })
  }

  save() {
    this.model.photo = this.listPhoto;
    this.model.variant = this.listVariant;
    const final = Object.assign(this.model)
    this.globalService.DataPost('/produk/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Product saved successfully')
        this.index();
      }
    })
  }

  onFileSelected(event: any) {
    const selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let item = {
        foto: { base64: reader.result as string }
      }
      this.listPhoto.push(item);
    };
    reader.readAsDataURL(selectedFile);
  }

  removePhoto(i) {
    this.listPhoto.splice(i, 1)
  }

  getListPhoto(id) {
    this.globalService.DataGet(`/produk/photo/${id}`, {}, false).subscribe((res: any) => {
      this.listPhoto = res.data;
    })
  }

  getListVariant(id) {
    this.globalService.DataGet(`/produk/variant/${id}`, {}, false).subscribe((res: any) => {
      this.listVariant = res.data;
    })
  }

  addVariant() {
    let row = {
      tipe: "color",
      varian: "",
      photo: "",
      harga: ""
    }
    this.listVariant.push(row);
  }

  removeVariant(i) {
    this.listVariant.splice(i, 1);
  }
}
