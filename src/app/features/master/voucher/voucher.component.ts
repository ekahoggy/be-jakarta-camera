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
    this.model.voucher_value = 0
    this.isEdit = false;
    this.isView = false;
    this.getUser()
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
    const final = Object.assign(this.model)
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
    let gambar = image;
    if (this.base64Image) {
      gambar = {
        base64: this.base64Image
      }
    }

    return gambar;
  }
}
