import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {
    pagingType: "full_numbers",
    serverSide: true,
    searching: false,
    lengthChange: false,
    ordering: false,
    processing: true,
  };

  listData: any;
  totalItems: number = 0;

  model: any = {};

  type: string = "admin"
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;

  constructor(
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.index();
  }

  index() {
    this.model = {};
    this.showForm = false;
    this.getData();
  }

  getData() {
    this.dtOptions = {
      pagingType: "full_numbers",
      serverSide: true,
      searching: false,
      lengthChange: false,
      ordering: false,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        let params = {
          type: this.type
        }

        this.globalService.DataGet('/user', params).subscribe((res: any) => {
          this.listData = res.data;
          this.totalItems = res.totalItems;
          callback({
            recordsTotal: res.totalItems,
            recordsFiltered: res.totalItems,
            data: [],
          });
        }, (error) => {
          let errorMessage = error.error.message
          console.log(errorMessage)
        });
      }
    };
  }

  reloadDataTable(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  create() {
    this.showForm = !this.showForm;
    this.model = {};
    this.isEdit = false;
    this.isView = false;
  }
  edit(data) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    data.password = ''
    this.model = data;
  }

  view() {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
  }

  save() {
    this.model.phone_code = "+62"
    this.model.roles_id = "1"
    this.model.type = "admin"

    if(this.isEdit){
      this.globalService.DataPost('/user/'+this.model.id, this.model).subscribe((res: any) => {
        if (res.status_code === 200) {
          this.globalService.alertSuccess('Berhasil', 'Data user admin berhasil diubah')
          this.index()
          this.reloadDataTable();
        }
      }, (error) => {
        let message = error.error.errors;
        this.globalService.alertError('Mohon Maaf', message)
      })
    }
    else{
      this.globalService.DataPost('/user', this.model).subscribe((res: any) => {
        if (res.status_code === 200) {
          this.globalService.alertSuccess('Berhasil', 'Data user admin berhasil disimpan')
          this.index()
          this.reloadDataTable();
        }
      }, (error) => {
        let message = error.error.errors;
        this.globalService.alertError('Mohon Maaf', message)
      })
    }
  }

  delete(id) {
    let param = {
      id: id,
      is_active: "terhapus"
    }

    Swal.fire({
      icon: "question",
      title: 'Apakah anda yakin?',
      text: "Ingin menghapus data ini",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        this.globalService.DataPut('/user/status', param).subscribe((res: any) => {
          if (res.status_code === 200) {
            this.reloadDataTable();
          }
        });
      }
    });
  }
}
