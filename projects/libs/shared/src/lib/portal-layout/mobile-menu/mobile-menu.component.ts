import {Component, OnInit, ElementRef, ViewChild, inject} from '@angular/core';
import {filter, skip} from 'rxjs/operators';
import {MatSidenav} from '@angular/material/sidenav';
import {MatAccordion} from '@angular/material/expansion';
import {HttpClient} from '@angular/common/http';
import {EVENT_SERVICE} from '../../types';
import {EventService} from '../../event-service/event.service';
@Component({
  selector: 'app-portal-mobile-menu-layout',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  standalone: false
})
export class PortalMobileMenuComponent {
  @ViewChild('sidenav') sideNav!: MatSidenav;
  @ViewChild(MatAccordion) menuPanel!: MatAccordion;
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  menuitems: any;
  public panelOpenState = false;
  public isopen = false;

  private eventService = inject<EventService>(EVENT_SERVICE);
  private httpClient = inject(HttpClient);

  constructor() {
    this.eventService
      .get('menuClick')
      .pipe(
        skip(1),
        filter((x) => x !== undefined)
      )
      .subscribe((_: any) => {
        this.isopen = !this.isopen;
      });

    this.httpClient.get('assets/menu.json').subscribe((data) => {
      this.menuitems = data;
    });
  }
}
