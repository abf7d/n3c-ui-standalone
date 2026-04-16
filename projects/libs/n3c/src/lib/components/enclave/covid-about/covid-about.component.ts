import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-covid-about',
  templateUrl: './covid-about.component.html',
  styleUrls: ['./covid-about.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cCovidAboutComponent extends N3cBaseComponent implements OnInit {
  public output: any;
  public frameworkComponents: any;

  constructor(
    private titleService: Title,
    protected strapiApi: StrapiApiService,
    @Inject(API_URLS) configuration: Endpoints,
    public contentManager: ContentManagerService
  ) {
    super(configuration, strapiApi);
    this.contentBlock = ['block1', 'block2', 'block3', 'block4'];
    this.pageLabel = 'N3C COVID About';
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - About');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('about', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageContent = this.contentManager.parseMdContent(this.pageContent);

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
