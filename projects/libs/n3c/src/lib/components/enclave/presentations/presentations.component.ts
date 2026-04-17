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
  selector: 'app-n3c-presentations',
  templateUrl: './presentations.component.html',
  styleUrls: ['./presentations.component.scss'],
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
export class N3cPresentationsPageComponent extends N3cBaseComponent implements OnInit {
  contentResourcesChunked: any[] = [];

  private titleService = inject(Title);
  public contentManager = inject(ContentManagerService);

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Webinars and Information Sessions');
    this.contentBlock = ['you_tube_videos'];
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('presentation', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};

        // Getting Content
        this.contentResources = this.contentManager.getContentObj(this.pageContent, this.contentBlock[0]);
        this.contentResourcesChunked = this.chunkArray(this.contentResources, 2);
        this.pageContent.header = 'Webinars and Information Sessions';
        this.dataLoading = false;
      },
      error: (error) => {
        this.showError = true;
        console.error('Error loading data', error);
        this.dataLoading = false;
      }
    });
  }

  chunkArray(arr: any[], chunkSize: number) {
    const chunks: any[] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
