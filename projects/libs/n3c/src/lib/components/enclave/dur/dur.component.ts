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
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-dur',
  templateUrl: './dur.component.html',
  styleUrls: ['./dur.component.scss'],
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
export class N3cDurComponent extends N3cBaseComponent implements OnInit {
  public output: any;
  public frameworkComponents: any;

  constructor(
    private titleService: Title,
    protected strapiApi: StrapiApiService,
    @Inject(API_URLS) configuration: Endpoints,
    public contentManager: ContentManagerService
  ) {
    super(configuration, strapiApi);
    this.contentBlock = ['prereq_graphic', 'submit_graphic'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Data Use Requests');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('dur-request', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};

        // Parse strings
        this.pageContent = this.contentManager.parseMdContent(this.pageContent);

        // pre_req images & submit_graphic images
        for (let i = 0; i < this.contentBlock.length; i++) {
          let graphicContent = this.pageContent[this.contentBlock[i]].data.attributes.url;
          this.pageContent[this.contentBlock[i]] = this.n3cUrls.strapiUrl + graphicContent;
        }

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
