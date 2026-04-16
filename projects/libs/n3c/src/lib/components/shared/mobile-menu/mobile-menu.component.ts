import {Component, ViewChild, Inject} from '@angular/core';
import {filter, skip} from 'rxjs/operators';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {HttpClient} from '@angular/common/http';
import {EventService} from '@odp/shared/lib/event-service/event.service';
import {EVENT_SERVICE} from '@odp/shared/lib/types';

import {RouterModule} from '@angular/router';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-n3c-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  imports: [RouterModule, MatSidenavModule, MatExpansionModule, MatListModule]
})
export class N3cMobileMenuComponent {
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

    const menuMapping: {[key: string]: string} = {
      '/covid': 'assets/n3c/menu/covid-menu.json',
      '/cancer': 'assets/n3c/menu/cancer-menu.json',
      '/clinical-cohort': 'assets/n3c/menu/clinical-menu.json',
      '/education': 'assets/n3c/menu/education-menu.json',
      '/renal': 'assets/n3c/menu/renal-menu.json'
    };

    let menu: string = 'assets/menu.json'; // Global default menu path
    const urlPath = window.location.pathname;

    // Check if the path matches anything in the menuMapping
    const isMapped = Object.keys(menuMapping).some((key) => {
      if (urlPath.includes(key)) {
        menu = menuMapping[key];
        return true; // Stop further iteration once a match is found
      }
      return false;
    });

    if (!isMapped) {
      menu = 'assets/n3c/menu/clinical-menu.json';
    }

    // Fetch the menu items
    this.httpClient.get(menu).subscribe((data) => {
      this.menuitems = data;
    });
  }
}
