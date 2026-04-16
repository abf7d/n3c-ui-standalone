import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ViewEncapsulation} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {StrapiResult} from '../../../models/strapi-default';
import {StrapiImage} from '../../../models/strapi-image';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-mission',
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss',
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
export class N3cMissionComponent extends N3cBaseComponent implements OnInit {
  agencyPartnerImage: any;
  distributedNetworkImages: StrapiImage[] = [];

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) configuration: Endpoints,
    public contentManager: ContentManagerService
  ) {
    super(configuration, strapiApi);
    this.pageLabel = 'N3C Mission';
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Mission');
  }

  getImageUrl(imageData: any): string {
    return `${this.n3cUrls.strapiUrl}${imageData?.attributes?.logo?.data?.attributes?.url}`;
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('mission', ['partner_groups.partners']).subscribe({
      next: (results) => {
        this.pageContent = results?.data?.attributes || {};
        this.pageContent.block1 = this.md.parse(this.pageContent?.block1);

        const partners = this.pageContent?.partner_groups?.data;
        if (partners && partners.length > 0) {
          // Directly access the first partner for "Agency Partners"
          const firstPartner = partners[0]?.attributes?.partners?.data[0];
          if (firstPartner) {
            this.agencyPartnerImage = {
              url: this.getImageUrl(firstPartner),
              width: firstPartner.attributes.logo.data.attributes.width,
              height: firstPartner.attributes.logo.data.attributes.height
            };
          }
          // Extract the rest of the partners for "Distributed Networks"
          // Start the for loop from the second partner group
          for (let i = 1; i < partners.length; i++) {
            const group = partners[i];
            const partnersInGroup = group.attributes.partners.data;

            // Loop through each partner in the current group
            for (let j = 0; j < partnersInGroup.length; j++) {
              const partner = partnersInGroup[j];

              // Add the partner to the distributedNetworkImages array
              this.distributedNetworkImages.push({
                url: this.getImageUrl(partner)
              });
            }
          }
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
