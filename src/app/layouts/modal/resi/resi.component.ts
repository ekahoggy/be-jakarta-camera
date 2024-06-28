import { Component } from '@angular/core';

@Component({
  selector: 'app-resi',
  templateUrl: './resi.component.html',
  styleUrls: ['./resi.component.scss']
})
export class ResiComponent {
  modelResi: any = {};
  qtyPaketResi = 0;
  beratPaketResi = 0;
  asuransiPaket = 0;
  isiPaketResi = '';
  detailResi = [];
}
