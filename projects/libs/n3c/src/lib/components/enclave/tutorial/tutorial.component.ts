import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ViewEncapsulation, AfterViewInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {DomSanitizer} from '@angular/platform-browser';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-n3c-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent,
    N3cLoaderComponent
  ]
})
export class N3cTutorialComponent extends N3cBaseComponent implements OnInit, AfterViewInit {
  private titleService = inject(Title);
  public sanitizer = inject(DomSanitizer);
  private contentManager = inject(ContentManagerService);

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Tutorial');
    this.contentBlock = ['you_tube_videos'];
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Ensuring view children are fully initialized.
    setTimeout(() => {}, 500); // A slight delay can sometimes help.
  }

  loadData(): void {
    this.strapiService.get<StrapiResult>('tutorial', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};

        // Getting Content
        this.contentResources = this.contentManager.getContentObj(this.pageContent, this.contentBlock[0]);
        this.pageContent.block = this.md.parse(this.pageContent?.block);
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
