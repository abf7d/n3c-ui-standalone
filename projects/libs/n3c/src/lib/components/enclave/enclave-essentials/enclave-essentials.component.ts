import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {ViewEncapsulation} from '@angular/core';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-domain-teams',
  templateUrl: './enclave-essentials.component.html',
  styleUrl: './enclave-essentials.component.scss',
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
export class N3cEnclaveEssentialsComponent extends N3cBaseComponent implements OnInit {
  public descriptionImg: string = '';
  public pageDescription: any;
  public pageUserTiles: any[] = [];
  public userTileThumbs: string[] = [];
  public pageNavTiles: any[] = [];
  public navTileThumbs: string[] = [];

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    private contentManager: ContentManagerService,
    @Inject(API_URLS) private configuration: Endpoints
  ) {
    super(configuration, strapiApi);
    this.contentBlock = ['description', 'user_tiles', 'nav_tiles'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Enclave Essentials');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('enclave-essential', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageDescription = this.pageContent?.description?.data?.attributes;
        this.pageContent.description.data.attributes.content = this.md.parse(this.pageDescription?.content);
        this.descriptionImg = this.contentManager.getImageUrls(this.pageDescription, ['image'])[0];

        // User Tiles
        this.pageUserTiles =
          this.pageContent?.user_tiles?.data?.map((tile: any) => {
            tile.attributes.content = this.md.parse(tile.attributes.content);
            return tile.attributes;
          }) || [];
        this.userTileThumbs = this.pageUserTiles.map((tile) => this.contentManager.getThumbnailUrl(tile, 'image'));

        // Nav Tiles
        this.pageNavTiles =
          this.pageContent?.nav_tiles?.data?.map((tile: any) => {
            return tile.attributes;
          }) || [];
        this.navTileThumbs = this.pageNavTiles.map((tile) => this.contentManager.getThumbnailUrl(tile, 'image'));

        // Other content
        this.pageContent.block1 = this.md.parse(this.pageContent?.block1);
        this.dataLoading = false;
      },
      error: (error) => {
        this.showError = true;
        this.dataLoading = false;
        console.error('Error loading data', error);
      }
    });
  }
}
