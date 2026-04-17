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
import {ExternalLinkComponent} from '../../shared/external-link/external-link.component';

@Component({
  selector: 'app-n3c-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent,
    ExternalLinkComponent
  ]
})
export class N3cOnboardingComponent extends N3cBaseComponent implements OnInit {
  public contentResponseImageBlock: any;
  public stepBlocks: any[] = [];
  public stepImages: any[] = [];
  public navBlocks: any[] = [];
  public navImages: any[] = [];
  public contentResourceImage = '';

  private titleService = inject(Title);
  private contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.contentBlock = ['left_header_image', 'right_header_image', 'step', 'nav_tiles'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Onboarding');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('onboarding', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageContent.block = this.md.parse(this.pageContent?.block);
        this.pageContent.block2 = this.md.parse(this.pageContent?.block2);

        this.contentResponseImageBlock = this.pageContent?.left_header_image?.data?.attributes || {};

        const stepData = this.pageContent?.step?.data || [];
        this.stepBlocks = stepData.map((item: any) => item?.attributes || {});
        this.stepImages = this.stepBlocks.map((block) => this.contentManager.getImageUrls(block, ['image']));
        this.contentResourceImage = <string>(
          this.contentManager.getImageUrls(this.pageContent, ['left_header_image'])?.[0]
        );

        const navData = this.pageContent?.nav_tiles?.data || [];
        this.navBlocks = navData.map((item: any) => item?.attributes || {});
        this.navImages = this.navBlocks.map((block) => this.contentManager.getImageUrls(block, ['icon']));

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
