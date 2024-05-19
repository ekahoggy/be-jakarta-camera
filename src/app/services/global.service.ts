
import { environment } from '../../environments/environment.development';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  apiURL: string = environment.apiURL
  imgURL: string = environment.imgURL
  httpOptions: any;
  token: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.getToken();
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      }),
      withCredentials: false,
    };
  }

  getImage(folder: string, image: string) {
    let ret;

    if (image !== '' && image !== null && folder !== '') {
      ret = this.imgURL + folder + '/' + image;
    } else if (image !== '' && image !== null && folder === '') {
      ret = this.imgURL + image;
    } else {
      ret = this.imgURL + 'default.png';
    }
    return ret;
  }

  DataGet(path: string, payloads = {}, credentials: boolean = true) {
    this.getToken();
    return this.http.get(this.apiURL + path, {
      params: payloads,
      withCredentials: credentials,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      }),
    });
  }


  DataApi(path: string, payloads = {}) {
    return this.http.get(path);
  }

  /**
   * Request POST
   */
  DataPost(path: string, payloads = {}, withCredentials: boolean = true, isHtml: boolean = false) {
    this.getToken();
    if (isHtml === true) {
      const reqHeader = {
        responseType: 'text' as 'json',
        withCredentials: withCredentials,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        }),
      };
      return this.http.post(this.apiURL + path, payloads, reqHeader);
    } else {
      const reqHeader = this.httpOptions;
      return this.http.post(this.apiURL + path, payloads, withCredentials ? reqHeader : '');
    }
  }

  /**
   * Request POST
   */
  DataPut(path: string, payloads = {}, withCredentials: boolean = true, isHtml: boolean = false) {
    this.getToken();
    if (isHtml === true) {
      const reqHeader = {
        responseType: 'text' as 'json',
        withCredentials: withCredentials,
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token,
        }),
      };
      return this.http.put(this.apiURL + path, payloads, reqHeader);
    } else {
      const reqHeader = this.httpOptions;
      return this.http.put(this.apiURL + path, payloads, withCredentials ? reqHeader : '');
    }
  }

  getAuth() {
    let encoded = localStorage.getItem('session');
    if (encoded) {
      return JSON.parse(atob(encoded));
    }
    return null;
  }

  getToken() {
    let auth = this.getAuth();
    if (auth !== null) {
      this.token = auth.token.original.access_token;
      return this.token;
    }
    else {
      return null;
    }
  }

  destroyAuth() {
    localStorage.removeItem('session');
    return this.router.navigate(['account/login']);
  }

  alertSuccess(title: string, text: string, timer: number = 1500) {
    Swal.fire({ icon: "success", title: title, text: text, timer: timer });
  }

  alertError(title: string, text: any, timer: number = 1500) {
    let message: any = [];

    if (this.isObject(text)) {
      for (let key in text) {
        if (text.hasOwnProperty(key)) {
          message.push(text[key] + '<br>');
        }
      }
      let html = message.join('');
      Swal.fire({ icon: "error", title: title, html: html, timer: 2000 });
    } else {
      Swal.fire({ icon: "error", title: title, text: text, timer: timer });
    }
  }

  alertQuestion(title: string, text: string, timer: number = 1500) {
    Swal.fire({ icon: "question", title: title, text: text, timer: timer });
  }

  /**
     * Sweet alert info
     */
  alertInfo(title, content, html = false, timer = 3.5) {
    if (html == false) {
      Swal.fire({
        title,
        text: content,
        icon: 'info',
        timer: timer * 1000,
        showConfirmButton: true,
      });
    } else if (html == true) {
      Swal.fire({
        title,
        html: content,
        icon: 'info',
        timer: timer * 1000,
        showConfirmButton: true,
      });

    }
  }

  isObject(variable: any) {
    return typeof variable === 'object' && variable !== null;
  }

  alertWithButton(title: string, text: string, type: string) {
  }
}
