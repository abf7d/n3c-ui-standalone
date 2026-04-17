import {Component, inject} from '@angular/core';
import {API_URLS, Endpoints, N3CEndpoints} from '../../types';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {N3C_BASE_MENU_TYPES, N3C_BASE_TENANT_TYPES} from '../base-enums.enum';
import * as marked from 'marked';
import {StrapiApiService} from '@odp/n3c/lib/services/api/strapi-api/strapi-api.service';
import {StrapiResult} from '@odp/n3c/lib/models/strapi-default';
import {Router} from '@angular/router';

interface InitOpts {
  landingPage?: boolean;
}

@Component({
  selector: 'app-lib-base',
  template: '',
  standalone: false
})
export class N3cBaseComponent {
  private baseRouter: Router = inject(Router);
  public baseRoute = '';

  private parentPath = '../n3c/menu';
  public n3cUrls: N3CEndpoints = (inject(API_URLS) as unknown as Endpoints).n3cUrls;

  public pageContent: any = {};
  public md = marked.setOptions({});

  public menu: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public tenant: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public pageLabel = '';
  public pageTitle = '';
  public showError = false;
  public dataLoading = true;

  public strapiService: StrapiApiService = inject(StrapiApiService);
  public contentBlock!: Array<string>;
  public contentResources: any;

  public initializeData(tenantId: number, menuName: string, contentUrl?: string | null, isLandingPage = false): void {
    this.showError = false;
    const menuUrl = fetch(`${this.parentPath}/${menuName.toLowerCase()}-menu.json`).then((response) => response.json());
    const tenantUrl = this.strapiService.get<StrapiResult>(`tenant-profiles/${tenantId}`, ['icon', 'banner_icon']);

    let endpoints$ = [menuUrl, tenantUrl];

    forkJoin(endpoints$).subscribe({
      next: ([menuData, tenantData]) => {
        this.menu.next(menuData);
        this.tenant.next(tenantData);

        const tenantLandingPages = [
          N3C_BASE_TENANT_TYPES.TENANT_TYPE_EDUCATION,
          N3C_BASE_TENANT_TYPES.TENANT_TYPE_CANCER,
          N3C_BASE_TENANT_TYPES.TENANT_TYPE_RENAL
        ];

        // Handling Landing Pages
        if (tenantLandingPages.includes(tenantId) && isLandingPage === true) {
          const tenantAttributes = tenantData?.data?.attributes;
          this.pageContent = tenantAttributes;
          this.pageContent.description = this.md.parse(tenantAttributes?.description || '');
        }

        // Let derived components decide what to do next with the data
        this.onBaseDataLoaded();
      },
      error: (error) => {
        this.showError = true;
        this.dataLoading = false;
        console.error('Error loading data', error);
      }
    });
  }

  // Hook method - override this in child component
  protected onBaseDataLoaded(): void {
    this.dataLoading = false; // if not set in child component
  }

  getRouterLinkParts(url: string): {link: string[]; fragment?: string} {
    const [path, fragment] = url.split('#');

    if (!fragment) {
      return {link: [url]};
    }

    const link = path || this.baseRouter.routerState.snapshot.url.split('#')[0];
    return {link: [link], fragment};
  }

  initDataByRoute(opts?: InitOpts): void {
    const tenantMapping = [
      {
        route: '/clinical-cohort',
        tenantType: N3C_BASE_TENANT_TYPES.TENANT_TYPE_CLINICAL,
        menuName: N3C_BASE_MENU_TYPES.MENU_NAME_CLINICAL
      },
      {
        route: '/education',
        tenantType: N3C_BASE_TENANT_TYPES.TENANT_TYPE_EDUCATION,
        menuName: N3C_BASE_MENU_TYPES.MENU_NAME_EDUCATION
      },
      {
        route: '/covid',
        tenantType: N3C_BASE_TENANT_TYPES.TENANT_TYPE_COVID,
        menuName: N3C_BASE_MENU_TYPES.MENU_NAME_COVID
      },
      {
        route: '/renal',
        tenantType: N3C_BASE_TENANT_TYPES.TENANT_TYPE_RENAL,
        menuName: N3C_BASE_MENU_TYPES.MENU_NAME_RENAL
      },
      {
        route: '/cancer',
        tenantType: N3C_BASE_TENANT_TYPES.TENANT_TYPE_CANCER,
        menuName: N3C_BASE_MENU_TYPES.MENU_NAME_CANCER
      }
    ];

    const currentUrl = this.baseRouter.url;
    let matchedTenant = tenantMapping.find((mapping) => currentUrl.startsWith(mapping.route));

    if (!matchedTenant) {
      matchedTenant = tenantMapping.find((mapping) => mapping.route === '/clinical-cohort');
    }

    this.baseRoute = matchedTenant?.route || '';

    if (matchedTenant) {
      this.initializeData(matchedTenant.tenantType, matchedTenant.menuName, null, opts?.landingPage);
    }
  }

  isEmptyObject(obj: any) {
    return Object.entries(obj).length === 0;
  }
}
