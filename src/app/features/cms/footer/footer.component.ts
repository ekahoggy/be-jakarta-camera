import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  showForm: boolean = true;
  isEdit: boolean = false;
  isView: boolean = false;
  model: any = {};
  modelTentang: any = {};
  modelMarketplace: any = {};
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
    this.globalService.DataGet("/setting", { kategori: 'A' }, false).subscribe((res: any) => {
      res.data.forEach((val, k) => {
        if (val.name === 'alamat') {
          this.model.alamat = val.value
        }
        if (val.name === 'kodepos') {
          this.model.kodepos = val.value
        }
        if (val.name === 'no_hp') {
          this.model.no_hp = val.value
        }
        if (val.name === 'no_telp') {
          this.model.no_telp = val.value
        }
        if (val.name === 'email') {
          this.model.email = val.value
        }
        if (val.name === 'hari_kerja') {
          this.model.hari_kerja = val.value
        }
      });
    });

    this.globalService.DataGet("/setting", { kategori: 'F' }, false).subscribe((res: any) => {
      res.data.forEach((val, k) => {
        if (val.name === 'tentang_kami') {
          this.modelTentang.tentang_kami = val.value
        }
      });
    });
    this.globalService.DataGet("/setting", { kategori: 'M' }, false).subscribe((res: any) => {
      res.data.forEach((val, k) => {
        if (val.name === 'bukalapak') {
          this.modelMarketplace.bukalapak = val.value
        }
        if (val.name === 'shopee') {
          this.modelMarketplace.shopee = val.value
        }
        if (val.name === 'tokopedia') {
          this.modelMarketplace.tokopedia = val.value
        }
        if (val.name === 'blibli') {
          this.modelMarketplace.blibli = val.value
        }

        if (val.name === 'instagram') {
          this.modelMarketplace.instagram = val.value
        }
        if (val.name === 'tiktok') {
          this.modelMarketplace.tiktok = val.value
        }
        if (val.name === 'youtube') {
          this.modelMarketplace.youtube = val.value
        }
      });
    });
  }

  save() {
    const final = Object.assign(this.model)
    this.globalService.DataPost('/setting/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Setting Berhasil disimpan')
        this.getData();
      }
    })
  }

  saveTentang() {
    const final = Object.assign(this.modelTentang)
    this.globalService.DataPost('/setting/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Setting Berhasil disimpan')
        this.getData();
      }
    })
  }

  saveMarketplace() {
    const final = Object.assign(this.modelMarketplace)
    this.globalService.DataPost('/setting/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Setting Berhasil disimpan')
        this.getData();
      }
    })
  }
}
