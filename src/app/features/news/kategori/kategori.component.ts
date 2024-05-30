import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.component.html',
  styleUrls: ['./kategori.component.scss']
})
export class KategoriComponent implements OnInit {
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
  isLoading: boolean = false;

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
        this.globalService.DataGet("/news/kategori", params, false).subscribe((res: any) => {
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
    const final = Object.assign(this.model)
    this.globalService.DataPost('/news/kategori/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'Kategori berhasil disimpan')
        this.index();
      }
    },
      error => {
        this.empty();
        this.globalService.alertError('Gagal', error.error.message);
      })
  }

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/news/kategori/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data
      this.isLoading = false;
    })
  }

  reset() {
    this.modelParam = {
      kategori: ''
    }

    this.reloadDataTable()
  }
}
