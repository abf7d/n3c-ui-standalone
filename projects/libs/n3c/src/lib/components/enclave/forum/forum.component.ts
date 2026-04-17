import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
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
export class N3cForumComponent extends N3cBaseComponent implements OnInit {
  public output: any;
  public frameworkComponents: any;

  private titleService = inject(Title);
  public contentManager = inject(ContentManagerService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Forum');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('forum', ['forum_presentations.presenter']).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageContent.block1 = this.md.parse(this.pageContent.block1);

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
