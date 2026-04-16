import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {StrapiApiService} from '@odp/n3c/lib/services/api/strapi-api/strapi-api.service';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';

@Component({
  selector: 'app-n3c-standards',
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.scss'],
  imports: [CommonModule, RouterModule, HeaderViewComponent, N3cEnclaveFooterComponent, N3cMenuComponent]
})
export class N3cStandardsPageComponent extends N3cBaseComponent implements OnInit {
  public strapi: any; // Data from first endpoint

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) private configuration: Endpoints,
    private contentManager: ContentManagerService
  ) {
    super(configuration, strapiApi);

    this.n3cUrls = configuration.n3cUrls;
    this.contentBlock = ['content_image_block_rights'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Standards and Forms');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('form', this.contentBlock).subscribe(
      (formResult) => {
        this.strapi = formResult.data?.attributes || {};

        // Getting Content
        this.contentResources = this.contentManager.getContentObj(this.strapi, this.contentBlock[0]);
      },
      (error) => {
        console.error('Error loading data', error);
      }
    );
  }
}
