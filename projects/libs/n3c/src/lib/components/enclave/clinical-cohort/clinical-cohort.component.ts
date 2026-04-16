import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {forkJoin} from 'rxjs';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {DisclaimerFooterComponent} from '@odp/shared/lib/n3c/disclaimer-footer/disclaimer-footer.component';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {StrapiResult} from '../../../models/strapi-default';
import {N3C_BASE_TENANT_TYPES, N3C_TENANT_PROFILE_MAP} from '@odp/shared/lib/n3c/base-enums.enum';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-clinical-cohort',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    N3cLoaderComponent,
    DisclaimerFooterComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ],
  templateUrl: './clinical-cohort.component.html',
  styleUrls: ['./clinical-cohort.component.scss']
})
export class N3cClinicalCohortComponent extends N3cBaseComponent implements OnInit {
  constructor(
    private titleService: Title,
    protected strapiApi: StrapiApiService,
    @Inject(API_URLS) configuration: Endpoints
  ) {
    super(configuration, strapiApi);
    this.titleService.setTitle('N3C Clinical Cohort');
    this.pageTitle = 'National Clinical Cohort Collaborative (N3C) Homepage';
    this.pageLabel = 'N3C';
  }

  ngOnInit() {
    this.initDataByRoute();
  }

  override onBaseDataLoaded(): void {
    const apiRequests = [];

    for (const tenantParam in N3C_TENANT_PROFILE_MAP) {
      if (parseInt(tenantParam) === N3C_BASE_TENANT_TYPES.TENANT_TYPE_CLINICAL) continue;

      apiRequests.push(this.strapiService.get<StrapiResult>(`tenant-profiles/${tenantParam}`, ['icon', 'banner_icon']));
    }

    forkJoin(apiRequests).subscribe({
      next: (results) => {
        results.forEach((apiResult) => {
          const data = apiResult?.data?.attributes || {};
          let tenantImage = data?.icon?.data?.attributes?.url;

          if (tenantImage?.startsWith('/')) {
            tenantImage = tenantImage.substring(1);
          }

          const tenantImageUrl = `${this.n3cUrls.strapiUrl}/${tenantImage}`;
          const tenantProfile = N3C_TENANT_PROFILE_MAP[apiResult.data?.id];
          const tenantLinkUrl = `/${tenantProfile}`;

          this.pageContent[tenantProfile] = {
            label: data.label,
            imageUrl: tenantImageUrl,
            linkUrl: tenantLinkUrl,
            blurb: this.md(data.blurb),
            description: this.md(data.description)
          };
        });

        this.dataLoading = false;
      },
      error: (error) => {
        this.showError = true;
        this.dataLoading = false;
        console.error('Error loading tenant data', error);
      }
    });
  }
}
