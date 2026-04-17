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
  selector: 'app-n3c-acknowledgements',
  templateUrl: './acknowledgements.component.html',
  styleUrl: './acknowledgements.component.scss',
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
export class N3cAcknowledgementsComponent extends N3cBaseComponent implements OnInit {
  private titleService = inject(Title);
  private contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.contentBlock = ['content_image_block_rights'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Acknowledgements');
  }

  protected override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('acknowledgement', this.contentBlock).subscribe({
      next: (mainResults) => {
        this.pageContent = mainResults.data?.attributes || {};
        this.pageContent.block = this.md.parse(this.pageContent?.block);
        this.contentResources = this.contentManager.getContentObj(this.pageContent, this.contentBlock[0]);

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
