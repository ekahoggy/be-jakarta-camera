import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@haifahrul/ckeditor5-build-rich';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-berita',
  templateUrl: './berita.component.html',
  styleUrls: ['./berita.component.scss']
})
export class BeritaComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  // editor = ClassicEditor;
  // configEditor = {
  //   toolbar: [
  //     'undo',
  //     'redo',
  //     '|',
  //     'heading',
  //     'fontFamily',
  //     'fontSize',
  //     '|',
  //     'bold',
  //     'italic',
  //     'underline',
  //     'fontColor',
  //     'fontBackgroundColor',
  //     'highlight',
  //     '|',
  //     'link',
  //     'CKFinder',
  //     'imageUpload',
  //     'mediaEmbed',
  //     '|',
  //     'alignment',
  //     'bulletedList',
  //     'numberedList',
  //     '|',
  //     'indent',
  //     'outdent',
  //     '|',
  //     'insertTable',
  //     'blockQuote',
  //     'specialCharacters'
  //   ],
  //   language: 'id'
  // }

  //tinyMCE
  configMCE = {
    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
    ],
    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
  };
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  listData: any = [];
  model: any = {};
  modelParam: any = {};
  base64Image: string | null = null;
  listCategory: any = [];
  listTags: any = [];
  isLoading: boolean = false;
  content: any = null;
  panelOpenState = false;

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
        this.globalService.DataGet("/news", params, false).subscribe((res: any) => {
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
    this.listTags = [];
    this.content = null;
    this.base64Image = null;
    this.model.image = "assets/img/elements/18.jpg";
  }

  collapseInfo(){
    this.panelOpenState = !this.panelOpenState;
  }

  index() {
    this.showForm = !this.showForm;
    this.empty();
  }

  create() {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = false;
    this.empty();
    this.getListCategory();
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.model = val;
    this.getListCategory();
    this.listTags = val.tags
    this.content = val.content;
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.model = val;
    this.getListCategory();
    this.listTags = val.tags
    this.content = val.content;
  }

  getListCategory() {
    this.globalService.DataGet('/news-kategori', {}, false).subscribe((res: any) => {
      this.listCategory = res.data;
    })
  }

  ubahStatus(item, status) {
    let data = {
      id: item.id,
      is_publish: status
    };
    const final = Object.assign(data)
    this.globalService.DataPost('/news/status', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'News diubah')
        this.reloadDataTable()
      }
    },
      error => {
        this.empty();
        this.globalService.alertError('Gagal', error.error.message);
      })
  }

  save() {
    this.model.image = this.setImageBase64(this.model.image);
    if (this.model.image === "assets/img/elements/18.jpg") {
      this.model.image = {};
    }
    const final = Object.assign(this.model)
    this.globalService.DataPost('/news/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Berhasil', 'News berhasil disimpan')
        this.index();
      }
    },
      error => {
        this.empty();
        this.globalService.alertError('Gagal', error.error.message);
      })
  }

  addCustomTag = (tag) => ({ id: tag, name: tag });
  addCustomKategori = (kategori) => ({ id: kategori, kategori: kategori });

  getDataById(id: string = null) {
    this.isLoading = true;
    this.globalService.DataGet(`/news/${id}`, {}, false).subscribe((res: any) => {
      this.model = res.data
      this.model.image = this.globalService.getImage('news', this.model.image)
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
      judul: ''
    }

    this.reloadDataTable()
  }

  onChangeDetailEditor({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.model.content = data;
  }
}
