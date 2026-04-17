import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {ViewEncapsulation} from '@angular/core';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-team-creation',
  templateUrl: './team-creation.component.html',
  styleUrl: './team-creation.component.scss',
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
export class N3cTeamCreationComponent extends N3cBaseComponent implements OnInit {
  public pageData: any;
  public readyImg: any;
  public leadImg: any;
  public responsibilityImg: any;
  public guidelineImg: any;
  public resourcesImg: any;
  public contentResponseNavTiles: any;
  public imageUrls: any[] = [];

  private titleService = inject(Title);
  private contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.contentBlock = [
      'ready_image',
      'lead_image',
      'responsibility_image',
      'resources_image',
      'guideline_image',
      'guideline_faqs',
      'ready_faqs',
      'lead_faqs',
      'responsibility_faqs',
      'resources_faqs',
      'nav_tiles'
    ];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Team Creation');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('team-creation', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.contentResponseNavTiles = this.pageContent?.nav_tiles?.data?.map((tile: any) => tile.attributes) || [];
        this.imageUrls = this.contentResponseNavTiles.map((tile: any) =>
          this.contentManager.getThumbnailUrl(tile, 'icon')
        );
        this.readyImg = this.contentManager.getImageUrls(this.pageContent, ['ready_image']);
        this.leadImg = this.contentManager.getImageUrls(this.pageContent, ['lead_image']);
        this.responsibilityImg = this.contentManager.getImageUrls(this.pageContent, ['responsibility_image']);
        this.resourcesImg = this.contentManager.getImageUrls(this.pageContent, ['resources_image']);
        this.guidelineImg = this.contentManager.getImageUrls(this.pageContent, ['guideline_image']);

        this.pageContent.ready_block = this.md.parse(this.pageContent?.ready_block);
        this.pageContent.lead_block = this.md.parse(this.pageContent?.lead_block);
        this.pageContent.responsibility_header = this.md.parse(this.pageContent.responsibility_header);
        this.pageContent.responsibility_block = this.md.parse(this.pageContent?.responsibility_block);

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
