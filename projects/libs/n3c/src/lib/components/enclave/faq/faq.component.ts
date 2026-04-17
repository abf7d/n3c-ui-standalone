import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
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
export class N3cFaqPageComponent extends N3cBaseComponent implements OnInit {
  private titleService = inject(Title);
  private contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.contentBlock = [
      'enclave_faqs',
      'domain_faqs',
      'phenotype_faqs',
      'harmonization_faqs',
      'analytics_faqs',
      'synthetic_faqs'
    ];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Frequently Asked Questions');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('faq-list', this.contentBlock).subscribe({
      next: (results) => {
        this.pageContent = (results as StrapiResult)?.data?.attributes || {};
        this.pageContent = this.contentManager.parseMdContent(this.pageContent);
        this.pageContent.enclave_faqs = this.contentManager.getContentObj(this.pageContent, this.contentBlock[0]);
        this.pageContent.domain_faqs = this.contentManager.getContentObj(this.pageContent, this.contentBlock[1]);
        this.pageContent.phenotype_faqs = this.contentManager.getContentObj(this.pageContent, this.contentBlock[2]);
        this.pageContent.harmonization_faqs = this.contentManager.getContentObj(this.pageContent, this.contentBlock[3]);
        this.pageContent.analytics_faqs = this.contentManager.getContentObj(this.pageContent, this.contentBlock[4]);
        this.pageContent.synthetic_faqs = this.contentManager.getContentObj(this.pageContent, this.contentBlock[5]);

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
