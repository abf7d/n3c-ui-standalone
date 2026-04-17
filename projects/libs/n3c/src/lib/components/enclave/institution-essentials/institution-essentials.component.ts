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
  selector: 'app-n3c-education',
  templateUrl: './institution-essentials.component.html',
  styleUrl: './institution-essentials.component.scss',
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
export class N3cInstitutionEssentialsComponent extends N3cBaseComponent implements OnInit {
  public contentResponse: any;
  public navTilesData: any[] = [];
  public navTileImages: string[] = [];
  public contentResponseJoinBlock: any;
  public contentResourceJoinBlock: any;
  public contentResourceStep: any;
  public contentNoteBlock: string = '';
  public contentJoinBlock: string = '';

  private titleService = inject(Title);
  private contentManager = inject(ContentManagerService);

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - For Investigators');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('institutional-essential', ['nav_tiles', 'join_block', 'step']).subscribe({
      next: (response) => {
        this.contentResponse = response.data?.attributes || {};
        const navTiles = this.contentResponse?.nav_tiles?.data || [];

        this.navTilesData = navTiles.map((tile: any) => tile?.attributes || {});
        this.navTileImages = this.navTilesData.map((tile) => this.contentManager.getThumbnailUrl(tile, 'icon'));

        this.contentResponseJoinBlock = this.contentResponse?.join_block?.data?.attributes || {};
        this.contentJoinBlock = <string>this.md.parse(this.contentResponseJoinBlock.content);
        this.contentResourceJoinBlock = this.contentManager.getImageUrls(this.contentResponseJoinBlock, ['image']);
        this.contentResourceStep = this.contentManager.getContentObj(this.contentResponse, 'step');
        this.contentNoteBlock = <string>this.md.parse(this.contentResponse.block);

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
