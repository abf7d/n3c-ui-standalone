import {Component, inject, Input} from '@angular/core';
import {EventService} from '@odp/shared/lib/event-service/event.service';
import {EVENT_SERVICE} from '@odp/shared/lib/types';
import {ExternalLinkComponent} from '../external-link/external-link.component';
import {RouterModule} from '@angular/router';
import {BANNER_MSG_KEY} from '@odp/shared/lib/api-constants';
import {filter} from 'rxjs';

@Component({
  selector: 'app-header-view',
  templateUrl: './header-view.component.html',
  styleUrls: ['./header-view.component.scss'],
  imports: [ExternalLinkComponent, RouterModule],
  host: {'data-app': 'n3c'}
})
export class HeaderViewComponent {
  @Input() isN3C = false;
  public message: string = '';
  private eventService = inject<EventService>(EVENT_SERVICE);

  constructor() {
    this.eventService
      .get<string>(BANNER_MSG_KEY)
      .pipe(filter((x) => !!x))
      .subscribe((msg) => {
        if (msg) {
          this.message = msg;
        }
      });
  }

  menuClick() {
    this.eventService.get('menuClick').next(true);
  }
}
