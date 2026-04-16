import {Component, ViewChild, Inject} from '@angular/core';
import {filter, skip} from 'rxjs/operators';
import {MatSidenav} from '@angular/material/sidenav';
import {MatAccordion} from '@angular/material/expansion';
import {HttpClient} from '@angular/common/http';
import {EVENT_SERVICE} from '../types';
import {EventService} from '../event-service/event.service';
@Component({
  selector: 'app-mobile-menu-layout',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  standalone: false
})
export class MobileMenuComponent {
  @ViewChild('sidenav') sideNav!: MatSidenav;
  @ViewChild(MatAccordion) menuPanel!: MatAccordion;
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  menuitems: any;
  public panelOpenStates: Record<string, boolean> = {};
  public isopen = false;

  constructor(
    @Inject(EVENT_SERVICE) private eventService: EventService,
    private httpClient: HttpClient
  ) {
    this.eventService
      .get('menuClick')
      .pipe(
        skip(1),
        filter((x) => x !== undefined)
      )
      .subscribe(() => {
        this.isopen = !this.isopen;
      });

    const menu: string = 'assets/menu.json'; // Global default menu path

    // Fetch the menu items
    this.httpClient.get(menu).subscribe((data) => {
      this.menuitems = data;
    });
  }
}
