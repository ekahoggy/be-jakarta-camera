import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent{
  status: string = '';
  title: string = '';
  message: string = '';
  time: string = '';
  constructor(){}

  showToast(status : string, title: string, message: string, time = ''){
    this.status = status;
    this.title = title;
    this.message = message;
    this.time = time;
  }
}
