import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-publication-review',
  templateUrl: './publication-review.component.html',
  styleUrls: ['./publication-review.component.scss'],
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
export class N3cPublicationReviewComponent extends N3cBaseComponent implements OnInit {
  private titleService = inject(Title);
  public contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.contentBlock = ['intro_block', 'faqs1', 'faqs2'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Publication Review');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('publication-review', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageContent = this.contentManager.parseMdContent(this.pageContent);

        // Retrieving FAQs
        this.pageContent.faqs1 = this.contentManager.getContentObj(this.pageContent, 'faqs1');
        this.pageContent.faqs2 = this.contentManager.getContentObj(this.pageContent, 'faqs2');

        // Retrieving images
        this.pageContent.images = this.contentManager.getImageUrls(this.pageContent?.intro_block?.data?.attributes, [
          'image'
        ]);

        // Retrieving into Block
        const introBlockContent = this.pageContent?.intro_block?.data?.attributes;
        this.pageContent.intro_block.content = this.md.parse(introBlockContent.content);
        this.pageContent.intro_block.url = introBlockContent.url;
        this.pageContent.intro_block.url_label = introBlockContent.url_label;
        this.pageContent.intro_block.header = introBlockContent.header;

        delete this.pageContent?.intro_block?.data;

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
