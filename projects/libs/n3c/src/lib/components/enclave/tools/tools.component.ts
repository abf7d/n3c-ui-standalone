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
  selector: 'app-n3c-tools',
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss',
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
export class N3cToolsComponent extends N3cBaseComponent implements OnInit {
  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) protected configuration: Endpoints,
    private contentManager: ContentManagerService
  ) {
    super(configuration, strapiApi);
    this.contentBlock = ['description', 'tool'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Tools');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('tool', this.contentBlock).subscribe({
      next: (result) => {
        this.contentResources = result.data?.attributes || {};
        this.contentResources.block1 = this.md.parse(this.contentResources?.block1);

        this.contentResources[this.contentBlock[0]] = {
          header: this.contentResources[this.contentBlock[0]].data?.attributes?.header,
          content: this.contentResources[this.contentBlock[0]].data?.attributes?.content,
          imageUrl: this.contentManager.getImageUrls(this.contentResources[this.contentBlock[0]].data?.attributes, [
            'image'
          ])
        };
        this.contentResources[this.contentBlock[1]] = this.contentManager.getContentObj(
          this.contentResources,
          this.contentBlock[1]
        );
        this.pageContent = this.contentResources;
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
