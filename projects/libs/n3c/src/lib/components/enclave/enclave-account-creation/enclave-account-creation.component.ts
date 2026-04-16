import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
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
  selector: 'app-n3c-enclave-account-creation',
  templateUrl: './enclave-account-creation.component.html',
  styleUrl: './enclave-account-creation.component.scss',
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
export class N3cEnclaveAccountCreationComponent extends N3cBaseComponent implements OnInit {
  public contentResponseIntro: any;
  introImageUrls: Array<any> = [];

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    private contentManager: ContentManagerService,
    @Inject(API_URLS) private configuration: Endpoints,
    private route: ActivatedRoute
  ) {
    super(configuration, strapiApi);
    this.titleService.setTitle('N3C - Enclave Account Creation');
    this.contentBlock = ['intro', 'instructions'];
  }

  ngOnInit() {
    this.initDataByRoute();
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('account-creation', this.contentBlock).subscribe({
      next: (mainResult) => {
        this.pageContent = mainResult.data?.attributes || {};
        this.contentResponseIntro = mainResult.data?.attributes?.intro?.data?.attributes || {};
        this.contentResponseIntro.content = this.md.parse(this.contentResponseIntro?.content);
        this.pageContent.before_starting_block = this.md.parse(this.pageContent?.before_starting_block);
        this.contentResources = this.contentManager.getContentObj(this.pageContent, this.contentBlock[1]);
        this.introImageUrls = this.contentManager.getImageUrls(this.contentResponseIntro, ['image']);
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
