import {Component, Inject, OnInit} from '@angular/core';
import {EVENT_SERVICE} from '../types';
import {EventService} from '@odp/shared/public-api';
import {filter} from 'rxjs';
import {BANNER_MSG_KEY} from '../api-constants';

@Component({
  selector: 'app-fixed-header',
  templateUrl: './fixed-header.component.html',
  styleUrls: ['./fixed-header.component.scss'],
  standalone: false
})
export class FixedHeaderComponent {
  public message: string = '';
  constructor(@Inject(EVENT_SERVICE) private eventService: EventService) {
    this.eventService
      .get<string>(BANNER_MSG_KEY)
      .pipe(filter((x) => !!x))
      .subscribe((msg) => {
        if (msg) {
          this.message = msg;
        }
      });
  }
}
