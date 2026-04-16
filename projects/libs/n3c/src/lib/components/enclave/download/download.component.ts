import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ViewEncapsulation} from '@angular/core';
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
  selector: 'app-n3c-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cDownloadComponent extends N3cBaseComponent implements OnInit {
  imageUrls: string[] = Array(6).fill(''); // Initialize with empty strings for image URLs

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) configuration: Endpoints,
    private contentManager: ContentManagerService // Inject ContentManagerService
  ) {
    super(configuration, strapiApi);
    this.contentBlock = [
      'submit_graphic1',
      'submit_graphic2',
      'track_graphic1',
      'track_graphic2',
      'download_graphic1',
      'download_graphic2'
    ];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Download');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('download', this.contentBlock).subscribe({
      next: (results) => {
        this.pageContent = (results as StrapiResult)?.data?.attributes || {};

        // Get image URLs using ContentManagerService
        this.imageUrls = this.contentManager.getImageUrls(this.pageContent, this.contentBlock);

        // Parse content
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
