import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  listDetail: any = [];
  model: any = {};
  modelParam: any = {};
  base64Image: string | null = null;
  listCategory: any = [];
  isLoading: boolean = false;
  url;
  format;
  keyMCE = environment.tinyMCE;

  configMCE = {
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Jakarta Camera',
    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
  };

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
        this.globalService.DataGet("/edukasi/daftar", params, false).subscribe((res: any) => {
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
    this.modelParam.is_deleted = 0;
    this.model = {};
    this.model.tingkatan = 'beginner';
    this.listDetail = [];
    this.model.gambar = "assets/img/elements/18.jpg";
  }

  index() {
    this.showForm = !this.showForm;
    this.empty();
  }

  create() {
    this.showForm = !this.showForm;
    this.model.tingkatan = 'beginner';
    this.isEdit = false;
    this.isView = false;
    this.getListCategory();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.getListCategory();
    this.getDataById(val.id)
    this.getDetail(val.id);
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.getListCategory();
    this.getDataById(val.id)
    this.getDetail(val.id);
  }

  save() {
    this.model.gambar = this.setImageBase64(this.model.gambar);
    if (this.model.gambar === "assets/img/elements/18.jpg") {
      this.model.gambar = {};
    }
    let data = {
      data: this.model,
      detail: this.listDetail
    };
    const final = Object.assign(data)
    this.globalService.DataPost('/edukasi/daftar/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'Edukasi berhasil disimpan')
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
    this.globalService.DataGet(`/edukasi/daftar/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data
      this.model.gambar = this.globalService.getImage('edukasi', this.model.gambar)
      this.isLoading = false;
    })
  }

  getDetail(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/edukasi/daftar/detail/${id}`, {}, false).subscribe((res: any) => {
      this.listDetail = res.data
      this.isLoading = false;
    })
  }

  getListCategory() {
    this.globalService.DataGet('/edukasi/kategori', {}, false).subscribe((res: any) => {
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
      judul: '',
      kategori_id: null,
      is_deleted: 0
    }

    this.reloadDataTable()
  }

  addEdukasi() {
    let row = {
      video_url: "",
      title: "",
      urutan: 0,
      is_lock: true,
    }
    this.listDetail.push(row);
  }

  removeEdukasi(i) {
    this.listDetail.splice(i, 1);
  }

  changeLevel(level){
    this.model.tingkatan = level;
    console.log(this.model);
  }

  changeLock(event, i) {
    this.listDetail[i].is_lock = event.target.checked
  }

  changePublish(id, publish) {
    publish = publish === 1 ? 0 : 1;
    this.globalService.DataPost('/edukasi/daftar/status', { id: id, is_publish: publish }, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'Edukasi berhasil diubah')
        this.reloadDataTable()
      }
    },
      error => {
        this.empty();
        this.globalService.alertError('Gagal', error.error.message);
      })
  }

  changeStatus(id, status) {
    status = status === 1 ? 0 : 1;
    this.globalService.DataPost('/edukasi/daftar/status', { id: id, is_deleted: status }, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'Edukasi berhasil dihapus')
        this.reloadDataTable()
      }
    },
      error => {
        this.empty();
        this.globalService.alertError('Gagal', error.error.message);
      })
  }

  onSelectFile(event, i) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.listDetail[i].video_url = (<FileReader>event.target).result;
      }
    }
  }
}
