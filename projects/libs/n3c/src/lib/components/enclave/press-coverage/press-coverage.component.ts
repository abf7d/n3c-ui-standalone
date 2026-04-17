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
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-press-coverage',
  templateUrl: './press-coverage.component.html',
  styleUrl: './press-coverage.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    N3cMenuComponent,
    N3cLoaderComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cPressCoverageComponent extends N3cBaseComponent implements OnInit {
  public itemImages: any;

  private titleService = inject(Title);
  public contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.contentBlock = ['press_releases'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Press Coverage');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('news-item', this.contentBlock).subscribe({
      next: (result) => {
        // Assign the result from Strapi
        this.pageContent = result.data?.attributes || {};
        this.pageContent.header = 'N3C in the News';

        // Getting Content
        this.contentResources = this.contentManager.getContentObj(this.pageContent, this.contentBlock[0]);

        // sorting items by Date
        this.contentResources.sort((a: any, b: any) => {
          let aDate = new Date(a.date).valueOf(),
            bDate = new Date(b.date).valueOf();

          return bDate - aDate;
        });

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
