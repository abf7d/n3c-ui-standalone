import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
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
  selector: 'app-n3c-domain',
  templateUrl: './domain.component.html',
  styleUrl: './domain.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cDomainComponent extends N3cBaseComponent implements OnInit {
  public domain = '';
  public type = '';
  public pageData: any;
  public pageContentImg?: string;
  override readonly pageTitle = 'N3C - Domain Teams';

  private readonly types: Record<string, string> = {
    domain: 'domain_teams',
    cross_cutting: 'cross_cutting_teams',
    inactive_domain: 'inactive_domain_teams'
  };

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    private contentManager: ContentManagerService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(API_URLS) private configuration: Endpoints
  ) {
    super(configuration, strapiApi);
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle(this.pageTitle);

    this.route.paramMap.subscribe((params) => {
      const type = params.get('type') || '';
      this.domain = params.get('domain') || '';
      this.type = this.types[type] ?? '';
    });
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('domain', [`${this.type}.you_tube_videos`, `${this.type}.leads`]).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.contentResources = this.contentManager.getContentObj(this.pageContent, this.type);
        const match = this.contentResources.find((c: any) => c.alias === this.domain);
        if (match) {
          this.pageData = {
            ...match,
            you_tube_videos: this.contentManager.getContentObj(match, 'you_tube_videos')
          };
        }

        if (!match) this.router.navigate(['/404']);
        this.titleService.setTitle(`${this.pageTitle} - ${this.pageData.name}`);
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
