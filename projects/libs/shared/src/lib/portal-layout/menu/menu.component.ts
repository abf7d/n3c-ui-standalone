import {HttpClient} from '@angular/common/http';
import {Component, Inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {EVENT_SERVICE} from '../../types';
import {EventService} from '../../event-service/event.service';

@Component({
  selector: 'app-portal-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PortalMenuComponent {
  @Input() canCollapse = false;
  isNavbarCollapsed = true;
  menuItems!: any;
  secondSub!: any;
  constructor(
    @Inject(EVENT_SERVICE) private eventService: EventService,
    private httpClient: HttpClient
  ) {
    this.httpClient.get('assets/menu.json').subscribe((data) => {
      this.menuItems = data;
    });
  }

  menuClick() {
    this.eventService.get('menuClick').next(true);
  }
}
