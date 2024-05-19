import { Component, Input, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.scss']
})
export class CustomerAddressComponent {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  @Input() userId: string = "";
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  model: any = {};
  base64Image: string | null = null;
  listCategory: any = [];
  isLoading: boolean = false;
  hidePassword: boolean = true;
  listAddress: any = [];
  filter: any = {};

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
          filter: JSON.stringify(this.filter),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.globalService.DataGet("/address", params, false).subscribe((res: any) => {
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
    this.model.photo = "assets/img/elements/18.jpg";
    this.filter.user_id = this.userId;
  }

  index() {
    this.showForm = !this.showForm;
    this.empty();
    this.getData();
  }

  create() {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = false;
    this.model.phone_code = '+62';
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.getDataById(val.id)
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getDataById(val.id)
  }

  save() {
    this.model.photo = this.setImageBase64(this.model.photo);
    const final = Object.assign(this.model)
    this.globalService.DataPost('/address/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Shipping address saved successfully')
        this.index();
        this.reloadDataTable
      }
    })
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/address/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data
      this.model.photo = this.globalService.getImage('address', this.model.photo)
      this.isLoading = false;
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
    let photo = image;
    if (this.base64Image) {
      photo = {
        base64: this.base64Image
      }
    }

    return photo;
  }
}