import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';
import {
  CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray
} from "@angular/cdk/drag-drop";
import { NgFor } from '@angular/common';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})

export class ProductComponent implements OnInit {
  @ViewChild(CdkDropList) placeholder: CdkDropList;
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
  listCategory: any;
  listBrand: any;
  listPhoto: any = [];
  listVariant: any = [];

  //varian
  changeStokList: boolean = false;
  aktifkanVaraian1: boolean = false;
  aktifkanVaraian2: boolean = false;
  buttonAtasVarian1: boolean = true;
  buttonAtasVarian2: boolean = true;
  tampilkanVarian2: boolean = false;
  showVarian1: boolean = false;
  showVarian2: boolean = false;
  showTextInputVarian1: boolean = false;
  showTextInputVarian2: boolean = false;
  disabledFotoVarian: boolean = true;
  valueVarian1: any;
  valueVarian2: any;
  tipe_custom1: any;
  tipe_custom2: any;
  modelVarian: any = [];
  varian: any = [
    {
      'id': 'warna',
      'value': 'Warna',
      'is_deleted': false
    },
    {
      'id': 'ukuran',
      'value': 'Ukuran',
      'is_deleted': false
    }
  ];
  customTipeVarian1: any = [];
  customTipeVarian2: any = [];
  varian1: any = [];
  varian2: any = [];
  selectedVarian1: any = [];
  selectedVarian2: any = [];
  duplicate: any = [];
  fotoProdukReset: any = [
    {
      'id': 1,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 2,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 3,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 4,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 5,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 6,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 7,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 8,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    }
  ];
  fotoProduk: any = [
    {
      'id': 1,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 2,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 3,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 4,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 5,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 6,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 7,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    },
    {
      'id': 8,
      'name': "Foto",
      'urutan': 0,
      'foto': '',
      'isFoto': false
    }
  ];

  public items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;

  constructor(
    private globalService: GlobalService,
    private viewportRuler: ViewportRuler
  ) {
    this.target = null;
    this.source = null;
  }

  ngOnInit(): void {
    this.empty();
    this.getData();
    this.getListCategory();
    this.getListBrand();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fotoProduk, event.previousIndex, event.currentIndex);
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
        this.globalService.DataGet("/produk", params, false).subscribe((res: any) => {
          this.listData = res.data.list;
          this.listData.forEach(value => {
            value.variant.forEach(v => {
              v.is_edit = false;
            });
          });
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
      nama: '',
      m_kategori_id: null,
      m_brand_id: null
    }

    this.reloadDataTable()
  }

  empty() {
    this.model = {};
    this.listVariant = [];
  }

  index() {
    this.showForm = !this.showForm;
    this.getData();
  }

  create() {
    this.empty();
    this.showForm = !this.showForm;
    this.fotoProduk = this.fotoProdukReset;
    this.isEdit = false;
    this.isView = false;
    this.getListCategory();
    this.getListBrand();
    //varian
    this.modelVarian.useFotoVarian = 0;
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.model = val;
    this.getListCategory();
    this.getListBrand();
    this.getListPhoto(val.id);
    this.getListVariant(val.id);
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.model = val;
    this.getListCategory();
    this.getListBrand();
    this.getListPhoto(val.id);
    this.getListVariant(val.id);
  }

  getListCategory() {
    this.globalService.DataGet('/kategori', {}, false).subscribe((res: any) => {
      this.listCategory = res.data.list;
    })
  }

  getListBrand() {
    this.globalService.DataGet('/brand', {}, false).subscribe((res: any) => {
      this.listBrand = res.data.list;
    })
  }

  save() {
    this.model.photo = this.fotoProduk;
    this.model.variant = this.listVariant;
    const final = Object.assign(this.model)
    this.globalService.DataPost('/produk/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Product saved successfully')
        this.index();
      }
    })
  }

  onFileSelected(event: any, index) {
    const selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let foto = { base64: reader.result as string }
      this.fotoProduk.forEach((v, i) => {
        if (i === index) {
          this.fotoProduk[i].foto = foto;
          this.fotoProduk[i].isFoto = true;
        }
      });
    };
    reader.readAsDataURL(selectedFile);
  }

  removePhoto(index) {
    this.fotoProduk.forEach((v, i) => {
      if (i === index) {
        this.fotoProduk[i].foto = '';
        this.fotoProduk[i].isFoto = false;
      }
    });
  }

  getListPhoto(id) {
    this.globalService.DataGet(`/produk/photo/${id}`, {}, false).subscribe((res: any) => {
      this.fotoProduk = res.data;
    })
  }

  // fungsi variant
  onFileSelectedVarian(event: any, index) {
    const selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let foto = { base64: reader.result as string }
      this.listVariant.forEach((v, i) => {
        if (i === index) {
          this.listVariant[i].image = foto;
        }
      });
    };
    reader.readAsDataURL(selectedFile);
  }

  removePhotoVarian(index) {
    this.listVariant.forEach((v, i) => {
      if (i === index) {
        this.listVariant[i].image = '';
      }
    });
  }

  getListVariant(id) {
    this.globalService.DataGet(`/produk/variant/${id}`, {}, false).subscribe((res: any) => {
      this.listVariant = res.data;
      if(this.isEdit || this.isView){
        this.valueVarian1 = res.varian1;
        this.valueVarian2 = res.varian2;
      }
    })
  }

  addVariant() {
    this.aktifkanVaraian1 = true;
    this.buttonAtasVarian1 = false;
  }

  addVariant2() {
    this.aktifkanVaraian2 = true;
    this.buttonAtasVarian2 = false;
  }

  removeVariant() {
    this.aktifkanVaraian1 = false;
    this.aktifkanVaraian2 = false;
    this.buttonAtasVarian1 = true;
    this.buttonAtasVarian2 = false;
    this.showVarian1 = false;
    this.showVarian2 = false;
    this.listVariant = [];
    this.selectedVarian1 = [];
    this.selectedVarian2 = [];
    this.varian1 = [];
    this.varian2 = [];
    this.duplicate = [];
    this.modelVarian = [];
  }

  changeVarian1(e) {
    this.varian1 = [];
    this.modelVarian.varianValue1 = null;
    if (e) {
      this.valueVarian1 = e.id;
      if (this.valueVarian1 == 'warna' || this.valueVarian1 == 'ukuran') {
        this.globalService.DataGet(`/produk/variant/type/${e.id}`, {}, false).subscribe((res: any) => {
          this.varian1 = res.data;
        })
      }
      this.showVarian1 = true;
    }
    else {
      this.valueVarian1 = '';
      this.varian1 = [];
      this.showVarian1 = false;
    }
  }
  isiVarian1(e, tipe) {
    this.duplicate = [];
    let pushed = {
      nama: '',
      tipe: '',
      gambar: ''
    }
    e.forEach(item => {
      if (this.selectedVarian1.length > 0) {
        this.selectedVarian1.forEach(val => {
          if (val.nama !== item.nama) {
            pushed.nama = item.nama;
            pushed.tipe = tipe;
            pushed.gambar = '';
          }
        });
      }
      else {
        pushed.nama = item.nama;
        pushed.tipe = tipe;
        pushed.gambar = '';
      }
    });

    this.selectedVarian1.push(pushed);

    if (this.modelVarian.varianValue1.length > 0) {
      let row = {
        image: '',
        varian1: '',
        varian1_type: '',
        varian2: '',
        varian2_type: '',
        harga: 0,
        stok: '',
        berat: 0,
        status: 1,
        main: 0,
      }

      this.selectedVarian1.forEach(val => {
        row.varian1 = val.nama;
        row.varian1_type = val.tipe;
      });

      this.listVariant.push(row);
      this.disabledFotoVarian = false;
      this.tampilkanVarian2 = true;
    }
    else {
      this.disabledFotoVarian = true;
      this.tampilkanVarian2 = false;
    }
  }

  addVarian1() {
    this.showTextInputVarian1 = true;
  }

  addTipeVarian1 = (item) => (
    {
      id: item,
      nama: item
    }
  );

  simpanVarian = (item) => (
    {
      id: item,
      value: item,
      is_deleted: true
    }
  );

  changeVarian2(e) {
    this.duplicate = [];
    this.varian2 = [];
    this.modelVarian.varianValue2 = null;
    if (e) {
      this.valueVarian2 = e.id;
      if (this.valueVarian2 == 'warna' || this.valueVarian2 == 'ukuran') {
        this.globalService.DataGet(`/produk/variant/type/${e.id}`, {}, false).subscribe((res: any) => {
          this.varian2 = res.data;
        })
      }
      this.showVarian2 = true;
    }
    else {
      this.valueVarian2 = '';
      this.varian2 = [];
      this.showVarian2 = false;
    }
  }

  isiVarian2(e, tipe) {
    let pushed = {
      nama: '',
      tipe: '',
      gambar: ''
    }
    e.forEach(item => {
      if (this.selectedVarian2.length > 0) {
        this.selectedVarian2.forEach(val => {
          if (val.nama !== item.nama) {
            pushed.nama = item.nama;
            pushed.tipe = tipe;
            pushed.gambar = '';
          }
        });
      }
      else {
        pushed.nama = item.nama;
        pushed.tipe = tipe;
        pushed.gambar = '';
      }
    });

    this.selectedVarian2.push(pushed);
    this.listVariant.forEach(vari => {
      this.selectedVarian2.forEach(v2 => {
        vari.varian2 = v2.nama;
        vari.varian2_type = v2.tipe;
      });
    });

    let jumlahDatake2 = this.selectedVarian2.length;
    if (jumlahDatake2 == 1) {
      this.listVariant.forEach(ke1 => {
        this.selectedVarian2.forEach(ke2 => {
          ke1.varian2 = ke2.nama;
        });
      });
    }
    else if (jumlahDatake2 > 1) {
      console.log(jumlahDatake2);
      for (let i = 0; i < jumlahDatake2; i++) {
        this.listVariant.forEach(element => {
          this.duplicate.push(element);
        });
      }
      this.compareAllVarian();
    }

  }

  compareAllVarian() {
    let data = {
      'data_utama': this.duplicate,
      'data_second': this.selectedVarian2
    }
    const final = Object.assign(data)
    this.globalService.DataPost('/produk/prosesVariant', final, true).subscribe((res: any) => {
      this.listVariant = res.data;
    })
  }

  addVarian2() {
    this.showTextInputVarian2 = true;
  }

  addTipeVarian2 = (item) => (
    {
      id: item,
      nama: item
    }
  );

  add() {
    this.items.push(this.items.length + 1);
  }

  ubahStokList(val, i) {
    val.is_edit = true;
  }

  simpanStokList(val, i){
    const final = Object.assign(val)
    this.globalService.DataPost('/produk/updateStok', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Stok Varian berhasil diubah')
        this.reloadDataTable();
      }
    })
  }
}
