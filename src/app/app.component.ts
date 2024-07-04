import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd, ChildActivationStart, ChildActivationEnd, ActivationStart, ActivationEnd, ActivatedRoute, Routes } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    console.log('here');
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
    });

    /** spinner starts on init */
    this.spinner.show();
    this.modalService.dismissAll()

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }
}
