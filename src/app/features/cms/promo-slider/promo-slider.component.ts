import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-promo-slider',
  templateUrl: './promo-slider.component.html',
  styleUrls: ['./promo-slider.component.scss']
})
export class PromoSliderComponent {
  @ViewChild(DataTableDirective)
  dtElement: any = DataTableDirective;
  dtInstance: any = Promise<DataTables.Api>;
  dtOptions: DataTables.Settings = {};
  showForm: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  model: any = {};
  base64Image: string | null = null;
  base64ImageMobile: string | null = null;
  isLoading: boolean = false;
  listData: any = [];
  aktifSetting: boolean = false;

  constructor(
    private globalService: GlobalService,
  ) { }

  ngOnInit(): void {
    this.empty();
    this.getSetting();
    this.getData();
  }

  drop(event: CdkDragDrop<string[]>) {
    let idSlider = '';
    if (event.currentIndex !== event.previousIndex) {
      this.listData.forEach(val => {
        if (event.previousIndex === val.index_position) {
          idSlider = val.id;
        }
      });
      this.globalService.DataPost('/promo-slider/moveSlider', {
        id: idSlider, curr: event.currentIndex, prev: event.previousIndex
      }, true).subscribe((res: any) => { })
    }
    moveItemInArray(this.listData, event.previousIndex, event.currentIndex);
  }

  index() {
    this.showForm = !this.showForm;
    this.getSetting();
    this.getData();
  }

  getSetting() {
    this.globalService.DataGet("/setting", { kategori: 'W' }, false).subscribe((res: any) => {
      res.data.forEach(setting => {
        if (setting.name === 'popup') {
          if (setting.value === 'YES') {
            this.aktifSetting = true;
          }
          else {
            this.aktifSetting = false;
          }
        }
      });
    });
  }

  getData() {
    this.globalService.DataGet("/promo-slider", {}, false).subscribe((res: any) => {
      this.listData = res.data.list;
    });
  }

  updateSetting(e) {
    let data = {
      value: e.currentTarget.checked == true ? 'YES' : 'NO'
    }

    this.globalService.DataPost('/setting/updatePopup', data, true).subscribe((res: any) => { })
  }

  empty() {
    this.model.picture = "assets/img/elements/18.jpg";
  }

  create() {
    this.showForm = !this.showForm;
    this.model = {};
    this.base64Image = null;
    this.model.picture = "assets/img/elements/18.jpg";
    this.isEdit = false;
    this.isView = false;
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.model = {};
    this.isEdit = true;
    this.isView = false;
    this.model = val;
  }

  delete(id) {
    Swal.fire({
      title: 'Are you sure',
      text: 'Delete this data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.globalService.DataPost('/promo-slider/status', { id: id }, true).subscribe((res: any) => {
          if (res.status_code === 200) {
            this.globalService.alertSuccess(
              'Done',
              'PopUp successfully deleted!'
            );
            this.getData();
          } else {
            this.globalService.alertError('Sorry', res.errors
            );
          }
        });
      }
    });
  }

  save() {
    this.model.picture = this.setImageBase64(this.model.picture);
    const final = Object.assign(this.model)
    this.globalService.DataPost('/promo-slider/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'PopUp saved successfully')
        this.index();
      }
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

  setImageBase64(image, type = 'desktop') {
    let picture = image;
    if (this.base64Image && type === 'desktop') {
      picture = {
        base64: this.base64Image
      }
      return picture;
    }
    else if (this.base64ImageMobile && type === 'mobile') {
      picture = {
        base64: this.base64ImageMobile
      }
      return picture;
    }
  }

  reset() {

  }
}
