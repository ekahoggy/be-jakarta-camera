import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd, ChildActivationStart, ChildActivationEnd, ActivationStart, ActivationEnd, ActivatedRoute, Routes } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Admin Panel Jakarta Camera';
  loadingRouteConfig: boolean = true;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loadingRouteConfig = true;
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof ActivationStart:
        case event instanceof RouteConfigLoadStart:
        case event instanceof ChildActivationStart:
        case event instanceof NavigationStart: {
          this.loadingRouteConfig = true;
          break;
        }

        case event instanceof ActivationEnd:
        case event instanceof RouteConfigLoadEnd:
        case event instanceof ChildActivationEnd:
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loadingRouteConfig = false;
          break;
        }
        default: {
          break;
        }
      }
      const conn = (navigator as any).connection;
      // if (conn) {
      //     if (conn.saveData) {
      //         console.log('here', conn);
      //     }
      //     const connectionlist = ["slow-2g", "2g", "3g", "4g"];
      //     this.effectiveType = conn.effectiveType;
      //     if (this.effectiveType !== "4g") {
      //         this.showAlertNetwork = true;
      //     }
      //     else {
      //         this.showAlertNetwork = false;
      //     }
      // }
      // this.modalService.dismissAll();
    });

    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }
}
