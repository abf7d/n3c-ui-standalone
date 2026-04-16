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
  selector: 'app-external-datasets',
  templateUrl: './external-datasets.component.html',
  styleUrl: './external-datasets.component.scss',
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
export class ExternalDatasetsComponent extends N3cBaseComponent implements OnInit {
  public contentResourcesDescription: Array<any> = [];
  public contentResourcesYoutube: Array<any> = [];
  public contentResourcesIngestion: Array<any> = [];
  public contentResourcesGraphic: Array<any> = [];
  public contentResourcesSupport: Array<any> = [];
  public contentResponseDescription: any;
  public contentResponseYoutube: any;
  public contentResponseIngestion: any;
  public contentResponseGraphic: any;
  public contentResponseSupport: any;
  public contentBlockYoutube: string;

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) private configuration: Endpoints,
    private contentManager: ContentManagerService
  ) {
    super(configuration, strapiApi);
    this.contentBlockYoutube = 'you_tube_video';
    this.contentBlock = ['description', 'you_tube_video', 'ingestion', 'graphic', 'support'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C External Datasets');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('external-dataset', this.contentBlock).subscribe({
      next: (mainResult) => {
        this.pageContent = mainResult.data?.attributes || {};
        this.pageContent.block1 = this.md.parse(this.pageContent?.block1);
        this.contentResponseDescription = this.pageContent?.description?.data?.attributes || {};
        this.pageContent.description.data.attributes.content = this.md.parse(
          this.pageContent?.description?.data?.attributes?.content
        );
        this.contentResponseYoutube = this.pageContent?.you_tube_video?.data?.attributes || {};
        this.contentResponseIngestion = this.pageContent?.ingestion?.data?.attributes || {};
        this.pageContent.ingestion.data.attributes.content = this.md.parse(
          this.pageContent?.ingestion?.data?.attributes?.content
        );
        this.contentResponseGraphic = this.pageContent?.graphic?.data?.attributes || {};
        this.contentResponseSupport = this.pageContent?.support?.data?.attributes || {};
        this.pageContent.support.data.attributes.content = this.md.parse(
          this.pageContent?.support?.data?.attributes?.content
        );

        // Generating Images and placing them in our map
        this.contentResourcesDescription = this.contentManager.getImageUrls(this.contentResponseDescription, ['image']);
        if (!(this.pageContent[this.contentBlockYoutube].data instanceof Array)) {
          this.pageContent[this.contentBlockYoutube].data = [this.pageContent[this.contentBlockYoutube].data];
        }
        this.contentResourcesYoutube = this.contentManager.getContentObj(this.pageContent, this.contentBlockYoutube);
        this.contentResourcesIngestion = this.contentManager.getImageUrls(this.contentResponseIngestion, ['image']);
        this.contentResourcesGraphic = this.contentManager.getImageUrls(this.pageContent, ['graphic']);
        this.contentResourcesSupport = this.contentManager.getImageUrls(this.contentResponseSupport, ['image']);

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
