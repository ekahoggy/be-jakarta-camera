import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss']
})
export class ProductCategoryComponent implements OnInit {
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
  base64Image: string | null = null;
  listCategory: any = [];
  isLoading: boolean = false;
  listInduk: any = [];

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
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.globalService.DataGet("/kategori", params, false).subscribe((res: any) => {
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

  getInduk(){
    this.globalService.DataGet('/kategori').subscribe((res: any) => {
      this.listInduk = res.data.list
    })
  }

  sinkron(){
    this.isLoading = true
    this.globalService.DataGet('/woocommerce/sinkron-kategori').subscribe((res: any) => {
      this.isLoading = false;
      this.globalService.alertSuccess('Berhasil', 'Kategori berhasil disinkron')
      this.reloadDataTable()
    })
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  empty() {
    this.model = {};
    this.model.icon = "assets/img/elements/18.jpg";
  }

  index() {
    this.showForm = !this.showForm;
    this.empty();
  }

  create() {
    this.empty()
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = false;
    this.getListCategory();
    this.getInduk()
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.getListCategory(val.id);
    this.getDataById(val.id)
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getListCategory(val.id);
    this.getDataById(val.id)
  }

  save() {
    this.isLoading = true;
    this.model.icon = this.setImageBase64(this.model.icon);
    if (this.model.icon === "assets/img/elements/18.jpg") {
      this.model.icon = {};
    }
    const final = Object.assign(this.model)
    this.globalService.DataPost('/kategori/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'Kategori berhasil disimpan')

        this.isLoading = false;
        this.index();
      }
    },
    error => {
        this.isLoading = false;
        this.empty();
        this.globalService.alertError('Gagal', error.error.message);
      })
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/kategori/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data;
      this.model.icon = res.data.icon == null ? "assets/img/elements/18.jpg" : res.data.icon;
      this.isLoading = false;
    })
  }

  getListCategory(id: string = null) {
    this.globalService.DataGet('/kategori', { notEqual: id }, false).subscribe((res: any) => {
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
      kategori: ''
    }

    this.reloadDataTable()
  }
}
