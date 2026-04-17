import {Component, inject, OnInit, AfterViewInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cTrainingPageComponent extends N3cBaseComponent implements OnInit, AfterViewInit {
  public contentResourcesShared: Array<any> = [];
  public contentResourcesPortal: Array<any> = [];
  public contentResourcesAdditional: Array<any> = [];
  public contentResourcesYoutube: Array<any> = [];

  private titleService = inject(Title);
  public sanitizer = inject(DomSanitizer);
  private contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.contentBlock = ['shared_resources', 'portal_resources', 'additional_resources', 'eug_you_tube_videos'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Training');
  }

  ngAfterViewInit(): void {
    // Ensuring view children are fully initialized.
    setTimeout(() => {}, 500); // A slight delay can sometimes help.
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('training', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageContent.block1 = this.md.parse(this.pageContent?.block1);
        this.pageContent.portal_block = this.md.parse(this.pageContent?.portal_block);
        this.pageContent.community_block = this.md.parse(this.pageContent?.community_block);
        this.pageContent.eug_block = this.md.parse(this.pageContent?.eug_block);
        this.pageContent.eug_block2 = this.md.parse(this.pageContent?.eug_block2);
        this.pageContent.shared_resource_block = this.md.parse(this.pageContent?.shared_resource_block);

        // Generating Images and placing them in our map
        this.contentResourcesShared = this.contentManager.getContentObj(this.pageContent, this.contentBlock[0]);
        this.contentResourcesAdditional = this.contentManager.getContentObj(this.pageContent, this.contentBlock[2]);
        this.contentResourcesPortal = this.contentManager.getContentObj(this.pageContent, this.contentBlock[1]);
        this.contentResourcesYoutube = this.contentManager.getContentObj(this.pageContent, this.contentBlock[3]);

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
