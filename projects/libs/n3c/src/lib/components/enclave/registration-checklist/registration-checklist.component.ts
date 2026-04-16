import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {ViewEncapsulation} from '@angular/core';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-registration-checklist',
  templateUrl: './registration-checklist.component.html',
  styleUrl: './registration-checklist.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cRegistrationChecklistComponent extends N3cBaseComponent implements OnInit {
  public contentResponseIntro: any;

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) private configuration: Endpoints
  ) {
    super(configuration, strapiApi);
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Registration Checklist');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('account-checklist').subscribe({
      next: (mainResult) => {
        this.pageContent = mainResult.data?.attributes || {};
        this.pageContent.Checklist = this.md.parse(this.pageContent?.Checklist);
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
