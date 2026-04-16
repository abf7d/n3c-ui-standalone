import {CommonModule} from '@angular/common';
import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {Title} from '@angular/platform-browser';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

interface RouteData {
  strapiEndpoint: string;
  strapiFilters: Record<string, any>;
  strapiContentBlocks: string[];
  headerProp: string;
  contentProp: string;
  title: string;
  showHeader: boolean;
}

@Component({
  selector: 'app-n3c-simple-page',
  imports: [
    CommonModule,
    RouterModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './simple-page.component.html',
  styleUrl: './simple-page.component.scss'
})
export class N3cSimplePageComponent extends N3cBaseComponent implements OnInit {
  private strapiEndpoint = '';
  private strapiFilters: Record<string, any> = {};
  private strapiContentBlocks: string[] = [];
  private headerProp = '';
  private contentProp = '';

  public content = '';
  public title = '';
  public header = '';
  public showHeader = true;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) protected configuration: Endpoints
  ) {
    super(configuration, strapiApi);
  }

  ngOnInit(): void {
    const routeData = this.normalizeRouteData(this.route.snapshot.data as Partial<RouteData>);

    this.strapiEndpoint = routeData.strapiEndpoint;
    this.strapiFilters = routeData.strapiFilters;
    this.strapiContentBlocks = routeData.strapiContentBlocks;
    this.headerProp = routeData.headerProp;
    this.contentProp = routeData.contentProp;
    this.title = routeData.title;
    this.showHeader = routeData.showHeader;

    this.initDataByRoute();
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<any>(this.strapiEndpoint, this.strapiContentBlocks, this.strapiFilters).subscribe({
      next: (result) => {
        this.pageContent = Array.isArray(result.data) ? result.data?.[0]?.attributes : result?.data?.attributes || {};

        this.header = this.pageContent?.[this.headerProp];
        this.title = this.title || this.pageContent?.label || this.header;
        this.titleService.setTitle('N3C - ' + this.title);
        this.content = <string>this.md.parse(this.pageContent?.[this.contentProp]);
        this.dataLoading = false;
      },
      error: (error) => {
        this.showError = true;
        console.error('Error loading data', error);
        this.dataLoading = false;
      }
    });
  }

  private normalizeRouteData(data: Partial<RouteData>): RouteData {
    return {
      strapiEndpoint: data.strapiEndpoint ?? '',
      strapiFilters: data.strapiFilters ?? {},
      strapiContentBlocks: data.strapiContentBlocks ?? [],
      headerProp: data.headerProp ?? 'header',
      contentProp: data.contentProp ?? 'block',
      title: data.title ?? '',
      showHeader: data.showHeader ?? true
    };
  }
}
