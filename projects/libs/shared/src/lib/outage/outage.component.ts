import {Component, Inject, OnInit} from '@angular/core';
import {EventService} from '../event-service/event.service';
import {BANNER_MSG_KEY} from '../api-constants';
import {filter} from 'rxjs';
import {EVENT_SERVICE} from '../types';

@Component({
  selector: 'app-outage',
  imports: [],
  templateUrl: './outage.component.html',
  styleUrl: './outage.component.scss'
})
export class OutageComponent implements OnInit {
  public message: string = 'The site is currently unavailable';
  constructor(@Inject(EVENT_SERVICE) private eventService: EventService) {}

  ngOnInit(): void {
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
