import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { GlobalService } from '../../../services/global.service';
import {
  CdkDrag,
  CdkDragStart,
  CdkDropList, CdkDropListGroup, CdkDragMove, CdkDragEnter,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
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
  listCategory: any;
  listPhoto: any = [];
  listVariant: any = [];

  //varian
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
          filter: JSON.stringify({}),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.globalService.DataGet("/produk", params, false).subscribe((res: any) => {
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

  empty() {
    this.model = {};
    this.listPhoto = [];
    this.listVariant = [];
  }

  index() {
    this.showForm = !this.showForm;
    this.getData();
  }

  create() {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = false;
    this.getListCategory();
    //varian
    this.modelVarian.useFotoVarian = 0;
  }

  edit(val) {
    this.showForm = !this.showForm;
    this.isEdit = true;
    this.isView = false;
    this.model = val;
    this.getListCategory();
    this.getListPhoto(val.id);
    this.getListVariant(val.id);
  }

  view(val) {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.isView = true;
    this.model = val;
    this.getListCategory();
    this.getListPhoto(val.id);
    this.getListVariant(val.id);
  }

  getListCategory() {
    this.globalService.DataGet('/kategori', {}, false).subscribe((res: any) => {
      this.listCategory = res.data.list;
    })
  }

  save() {
    this.model.photo = this.listPhoto;
    this.model.variant = this.listVariant;
    const final = Object.assign(this.model)
    this.globalService.DataPost('/produk/save', final, true).subscribe((res: any) => {
      if (res.status_code == 200) {
        this.globalService.alertSuccess('Success', 'Product saved successfully')
        this.index();
      }
    })
  }

  onFileSelected(event: any) {
    const selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      let item = {
        foto: { base64: reader.result as string }
      }
      this.listPhoto.push(item);
    };
    reader.readAsDataURL(selectedFile);
  }

  removePhoto(i) {
    this.listPhoto.splice(i, 1)
  }

  getListPhoto(id) {
    this.globalService.DataGet(`/produk/photo/${id}`, {}, false).subscribe((res: any) => {
      this.listPhoto = res.data;
    })
  }

  getListVariant(id) {
    this.globalService.DataGet(`/produk/variant/${id}`, {}, false).subscribe((res: any) => {
      this.listVariant = res.data;
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
    this.aktifkanVaraian1 = true;
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
    // this.listVariant.splice(i, 1);
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
        varian2: '',
        harga: 0,
        stok: '',
        berat: 0,
        status: 1,
        main: 0,
      }

      this.selectedVarian1.forEach(val => {
        row.varian1 = val.nama;
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
    this.compareAllVarian();

  }

  compareAllVarian() {
    let row = {
      image: '',
      varian1: '',
      varian2: '',
      harga: 0,
      stok: '',
      berat: 0,
      status: 1,
      main: 0,
    }

    this.selectedVarian2.forEach(val => {
      row.varian2 = val.nama;
    });

    let jumlahDatake2 = this.selectedVarian2.length;
    if (jumlahDatake2 == 1) {
      this.listVariant.forEach(ke1 => {
        this.selectedVarian2.forEach(ke2 => {
          ke1.varian2 = ke2.nama;
        });
      });
    }
    else if (jumlahDatake2 >= 2) {
      for (let i = 0; i < jumlahDatake2; i++) {
        this.listVariant.forEach(element => {
          this.duplicate.push(element);
        });
      }

      // console.log(this.selectedVarian2);
      let data2_baru = [];
      this.selectedVarian2.forEach(item1 => {
        this.duplicate.forEach((item2, k) => {
          if (item1.nama != item2.varian2 && item1.nama != item2.varian1) {
            item2.varian2 = item1.nama;
            data2_baru.push(item2)
          }
          // if (item1.nama !== item2.varian2) {
          //   this.duplicate[k].nama = item1.nama;
          // this.duplicate[k].gambar = item1.gambar;
          // }
        });
      });

      this.duplicate.concat(data2_baru);
      console.log(this.duplicate);
      // console.log(this.duplicate);
    }
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

  shuffle() {
    this.items.sort(function () {
      return .5 - Math.random();
    });
  }

  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped(e) {
    if (!this.target)
      return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex)
      moveItemInArray(this.items, this.sourceIndex, this.targetIndex);
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    if (drop != this.activeContainer)
      return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    let dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex
      ? dropElement.nextSibling : dropElement));

    this.placeholder._dropListRef.enter(drag._dragRef, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }

  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top
    };
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
};

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
  const { top, bottom, left, right } = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right;
}
