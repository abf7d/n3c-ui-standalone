import {provideZoneChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {AppConfig, APP_CONF, API_URLS} from '@odp/shared/lib/types';

fetch('./config/config.json')
  .then((response) => response.json())
  .then((config: AppConfig) => {
    bootstrapApplication(AppComponent, {
      providers: [
        provideZoneChangeDetection(),
        {provide: APP_CONF, useValue: config},
        {provide: API_URLS, useValue: config.odp},
        ...appConfig.providers
      ]
    }).catch((err) => console.error(err));
  });
