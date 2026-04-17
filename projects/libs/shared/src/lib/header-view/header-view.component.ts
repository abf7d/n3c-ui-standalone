import {Component, inject, Input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EVENT_SERVICE} from '../types';
import {EventService} from '../event-service/event.service';
import {BANNER_MSG_KEY} from '../api-constants';
import {filter} from 'rxjs';
import {ExternalLinkComponent} from '../external-link/external-link.component';

@Component({
  selector: 'app-header-view',
  templateUrl: './header-view.component.html',
  styleUrls: ['./header-view.component.scss'],
  standalone: true,
  imports: [RouterModule, ExternalLinkComponent]
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
