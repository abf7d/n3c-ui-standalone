import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cCalendarComponent extends N3cBaseComponent implements OnInit {
  embedded: any;

  private titleService = inject(Title);

  constructor() {
    super();
    this.titleService.setTitle('N3C Calendar');
    this.pageLabel = 'N3C Calendar';
  }

  ngOnInit() {
    this.initDataByRoute();
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('calendar').subscribe({
      next: (results) => {
        this.pageContent = results?.data?.attributes || {};
        this.dataLoading = false;
      },
      error: (error) => {
        this.showError = true;
        console.error('Error loading data', error);
        this.dataLoading = false;
      }
    });
  }
}
