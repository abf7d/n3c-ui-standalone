import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule, ActivatedRoute} from '@angular/router';
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
  selector: 'app-n3c-forum',
  templateUrl: './pprl.component.html',
  styleUrls: ['./pprl.component.scss'],
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
export class N3cPprlComponent extends N3cBaseComponent implements OnInit {
  public output: any;
  public frameworkComponents: any;

  public sideMenu = {
    quickLinks: [
      {
        label: 'Regenstrief Linkage Honest Broker',
        href: 'https://www.regenstrief.org/n3c-lhb/'
      },
      {
        label: 'Datavant Support',
        href: 'https://datavant.zendesk.com/hc/en-us'
      },
      {
        label: 'NCATS Office of Strategic Alliances',
        href: 'mailto:NCATSPartnerships@mail.nih.gov'
      }
    ],
    contentsLinks: [
      {
        label: 'Introduction',
        href: 'introduction'
      },
      {
        label: 'Ways to Participate',
        href: 'functions'
      },
      {
        label: 'Governance',
        href: 'oversight'
      },
      {
        label: "FAQ's",
        href: 'faq'
      },
      {
        label: 'Glossary',
        href: 'glossary'
      }
    ]
  };

  constructor(
    private titleService: Title,
    protected strapiApi: StrapiApiService,
    @Inject(API_URLS) configuration: Endpoints,
    public contentManager: ContentManagerService,
    private route: ActivatedRoute
  ) {
    super(configuration, strapiApi);
    this.contentBlock = ['image1', 'image2', 'image3', 'image4', 'governance_image1', 'governance_image2', 'faqs'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - PPRL');
  }

  override onBaseDataLoaded(): void {
    this.strapiApi.get<StrapiResult>('pprl', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageContent = this.contentManager.parseMdContent(this.pageContent);
        this.pageContent.sideMenu = this.sideMenu;

        // Getting images
        let imageArray = this.contentManager.getImageUrls(this.pageContent, this.contentBlock);
        let imageContent: any = {};
        for (let i = 0; i < this.contentBlock.length; i++) {
          let key = this.contentBlock[i];
          if (key != 'faqs') {
            delete this.pageContent[key];
            imageContent[key] = imageArray[i];
          }
        }
        this.pageContent.images = imageContent;

        // Retrieving FAQs
        this.pageContent.faqs = this.contentManager.getContentObj(this.pageContent, 'faqs');

        this.dataLoading = false;
        setTimeout(() => {
          const fragment = this.route.snapshot.fragment;
          if (fragment) {
            const el = document.getElementById(fragment);
            if (el) {
              el.scrollIntoView({behavior: 'smooth', block: 'start'});
            }
          }
        }, 100);
      },
      error: (error) => {
        this.showError = true;
        console.error('Error loading data', error);
        this.dataLoading = false;
      }
    });
  }
}
