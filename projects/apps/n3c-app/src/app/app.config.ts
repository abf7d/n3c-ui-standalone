import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import {n3cRoutes, statusRoutes} from './app.routes';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {EventService} from '@odp/shared/lib/event-service/event.service';
import {EVENT_SERVICE} from '@odp/shared/lib/types';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(withFetch()),
    provideRouter(
      n3cRoutes.concat(statusRoutes),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    {provide: EVENT_SERVICE, useClass: EventService}
  ]
};
