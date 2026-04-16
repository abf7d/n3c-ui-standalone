import {Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from 'projects/n3c/src/lib/services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-researcher-essentials',
  templateUrl: './researcher-essentials.component.html',
  styleUrl: './researcher-essentials.component.scss',
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
export class N3cResearcherEssentialsComponent extends N3cBaseComponent implements OnInit {
  public contentResponseJoinBlock: any;
  public contentResourceJoinBlock: any;
  public contentResponseAccessBlock: any;
  public contentResourceAccessBlock: any;
  public contentResponseDomainBlock: any;
  public contentResourceDomainBlock: any;
  public contentResponseGovernanceBlock: any;
  public contentResourceGovernanceBlock: any;
  public contentJoinBlock = '';
  public contentAccessBlock = '';
  public contentDomainBlock = '';
  public contentGovernanceBlock = '';
  pageNavTiles: any[] = [];
  navTileThumbs: string[] = [];

  constructor(
    private titleService: Title,
    private contentManager: ContentManagerService,
    @Inject(API_URLS) configuration: Endpoints,
    private strapiApi: StrapiApiService
  ) {
    super(configuration, strapiApi);
    this.contentBlock = ['nav_tiles', 'join_block', 'access_block', 'domain_block', 'governance_block'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Researcher Essentials');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('researcher-essential', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};

        // Nav Tiles
        this.pageNavTiles =
          this.pageContent?.nav_tiles?.data?.map((tile: any) => {
            return tile.attributes;
          }) || [];
        this.navTileThumbs = this.pageNavTiles.map((tile) => this.contentManager.getThumbnailUrl(tile, 'icon'));

        this.contentResponseJoinBlock = this.pageContent?.join_block?.data?.attributes || {};
        this.contentResponseAccessBlock = this.pageContent?.access_block?.data?.attributes || {};
        this.contentResponseDomainBlock = this.pageContent?.domain_block?.data?.attributes || {};
        this.contentResponseGovernanceBlock = this.pageContent?.governance_block?.data?.attributes || {};

        this.contentJoinBlock = <string>this.md.parse(this.contentResponseJoinBlock.content);
        this.contentAccessBlock = <string>this.md.parse(this.contentResponseAccessBlock.content);
        this.contentDomainBlock = <string>this.md.parse(this.contentResponseDomainBlock.content);
        this.contentGovernanceBlock = <string>this.md.parse(this.contentResponseGovernanceBlock.content);

        this.contentResourceJoinBlock = this.contentManager.getImageUrls(this.contentResponseJoinBlock, ['image']);
        this.contentResourceAccessBlock = this.contentManager.getImageUrls(this.contentResponseAccessBlock, ['image']);
        this.contentResourceDomainBlock = this.contentManager.getImageUrls(this.contentResponseDomainBlock, ['image']);
        this.contentResourceGovernanceBlock = this.contentManager.getImageUrls(this.contentResponseGovernanceBlock, [
          'image'
        ]);

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
