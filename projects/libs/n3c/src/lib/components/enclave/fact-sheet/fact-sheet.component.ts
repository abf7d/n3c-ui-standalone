import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {forkJoin} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {SitemapApiService} from '../../../services/api/site-map-api/site-map-api.service';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';
import {LongCompactNumberPipe} from '@odp/n3c/lib/pipes/long-compact-number.pipe';
import {CurrentNotes, CurrentRelease} from '@odp/n3c/lib/models/admin-models';

@Component({
  selector: 'app-n3c-fact-sheet',
  templateUrl: './fact-sheet.component.html',
  styleUrls: ['./fact-sheet.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent,
    LongCompactNumberPipe
  ]
})
export class N3cFactSheetComponent extends N3cBaseComponent implements OnInit {
  currentRelease!: CurrentRelease;
  currentNotes!: CurrentNotes;

  private titleService = inject(Title);
  private siteApi = inject(SitemapApiService);

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Fact Sheet');
    this.pageLabel = 'N3C Fact Sheet';
  }

  override onBaseDataLoaded(): void {
    const factSheetRequest$ = this.strapiService.get('fact-sheet');
    const currentRelease$ = this.siteApi.getFactSheetCurrentRelease();
    const currentNotes$ = this.siteApi.getFactSheetCurrentNotes();

    forkJoin([factSheetRequest$, currentRelease$, currentNotes$]).subscribe({
      next: (results) => {
        this.pageContent = (results[0] as StrapiResult)?.data?.attributes || {};
        this.currentRelease = results[1];
        this.currentNotes = results[2];
        this.pageContent.block3 = this.md.parse(this.pageContent?.block3);
        this.dataLoading = false;
      },
      error: (error) => {
        this.showError = true;
        this.dataLoading = false;
        console.error('Error loading data', error);
      }
    });
  }
}
