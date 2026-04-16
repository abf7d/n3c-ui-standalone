import {CommonModule} from '@angular/common';
import {Component, Input, OnChanges, SimpleChanges, Inject} from '@angular/core';
import {API_URLS, Endpoints, EVENT_SERVICE, N3CEndpoints} from '@odp/shared/lib/types';
import {EventService} from '@odp/shared/lib/event-service/event.service';
import {N3cMobileMenuComponent} from '../mobile-menu/mobile-menu.component';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-n3c-menu',
  templateUrl: '../menu/menu.component.html',
  styleUrls: ['../menu/menu.component.scss'],
  imports: [CommonModule, N3cMobileMenuComponent, RouterModule]
})
export class N3cMenuComponent implements OnChanges {
  @Input() public menuContent!: any;
  @Input() public tenantContent!: any;

  public menuItems!: any;
  public tenantItems!: any;
  public n3cUrls!: N3CEndpoints;
  public menuTitle!: string;

  public mainLogoImage = './assets/n3c/images/clinical_cohort_logo_white_banner_2787a6bb96.png';
  public mainLink = '/clinical-cohort';
  public tenantLogo!: string;

  public fixData(obj: {[key: string]: any}) {
    if ('external' in obj && obj['external'] === true && 'href' in obj && obj['href'] !== '') {
      try {
        obj['href'] = obj['href'];
      } catch (error) {
        console.error('Invalid URL:', obj['href'], error);
      }
    }

    return obj;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Menu Items
    // If 'menuContent' object is null then let it exit & load again.
    if (changes['menuContent'].currentValue === null) {
      return;
    }
    const menuContent = changes['menuContent'].currentValue;

    for (let i = 0; i < menuContent.menu.length; i++) {
      let item = menuContent.menu[i];
      item = this.fixData(item);

      if (typeof item.dropdown !== 'undefined') {
        for (let j = 0; j < item.dropdown.length; j++) {
          let subItem = item.dropdown[j];
          subItem = this.fixData(subItem);
        }
      }
    }
    this.menuItems = menuContent;

    if ('tenantContent' in changes) {
      const tenantContent = changes['tenantContent'].currentValue.data.attributes;
      const tenantImageUrl = tenantContent.banner_icon.data.attributes.url;
      this.tenantLogo = this.n3cUrls.strapiUrl + tenantImageUrl;
    }
  }

  constructor(
    @Inject(API_URLS) configuration: Endpoints,
    @Inject(EVENT_SERVICE) private eventService: EventService
  ) {
    this.n3cUrls = configuration.n3cUrls;
    // nothing needed???
  }

  menuClick() {
    this.eventService.get('menuClick').next(true);
  }
}
