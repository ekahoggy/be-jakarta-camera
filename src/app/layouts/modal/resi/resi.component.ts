import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-resi',
  templateUrl: './resi.component.html',
  styleUrls: ['./resi.component.scss']
})

export class ResiComponent implements OnInit {
  modelResi: any = {};
  qtyPaketResi = 0;
  beratPaketResi = 0;
  asuransiPaket = 0;
  isiPaketResi = '';
  detailResi = [];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log('here');
  }
}
