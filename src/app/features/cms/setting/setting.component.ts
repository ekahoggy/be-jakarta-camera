import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit{
  showForm: boolean = true;
  isEdit: boolean = false;
  isView: boolean = false;
  model: any = {};
  base64Image: string | null = null;
  base64ImageFavicon: string | null = null;
  isLoading: boolean = false;
  listData: any = [];
  listTags: any = [];

  constructor(
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.globalService.DataGet("/setting", {kategori: 'S'}, false).subscribe((res: any) => {
      res.data.forEach((val, k) => {
        if(val.name === 'icon'){
          this.model.icon = val.value
        }
        if(val.name === 'favicon'){
          this.model.favicon = val.value
        }
        if(val.name === 'title'){
          this.model.title = val.value
        }
        if(val.name === 'deskripsi'){
          this.model.deskripsi = val.value
        }
        if(val.name === 'keyword'){
          this.model.keyword = val.value
          this.listTags = val.value;
        }
        if(val.name === 'author'){
          this.model.author = val.value
        }
      });
    });
  }

  save() {
    this.model.icon = this.setImageBase64(this.model.icon);
    this.model.favicon = this.setImageBase64(this.model.favicon, 'mobile');
    const final = Object.assign(this.model)
    this.globalService.DataPost('/setting/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Setting Berhasil disimpan')
        this.getData();
      }
    })
  }

  addCustomTag = (tag) => ({ id: tag, name: tag });

  onFileSelected(event: any) {
    const selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.base64Image = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }

  onFileSelectedMobile(event: any) {
    const selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.base64ImageFavicon = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }

  setImageBase64(image, type = 'desktop') {
    let picture = image;
    if (this.base64Image && type === 'desktop') {
      picture = {
        base64: this.base64Image
      }
      return picture;
    }
    else if (this.base64ImageFavicon && type === 'mobile') {
      picture = {
        base64: this.base64ImageFavicon
      }
      return picture;
    }
  }
}
