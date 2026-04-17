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
  selector: 'app-n3c-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
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
export class N3cPolicyComponent extends N3cBaseComponent implements OnInit {
  public frameworkComponents: any;
  public institutionResources: any;
  public userResources: any;

  private titleService = inject(Title);
  private contentManager = inject(ContentManagerService);

  constructor() {
    super();
    this.titleService.setTitle('N3C - Policy');
    this.contentBlock = ['institution_resources', 'user_resources'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Policy');
    this.loadData();
  }

  loadData(): void {
    this.strapiService.get<StrapiResult>('policy', this.contentBlock).subscribe({
      next: (result) => {
        const mainContent = result;
        const institutionContent = result.data?.attributes || {};
        const userContent = result.data?.attributes || {};
        this.pageContent = mainContent.data?.attributes || {};
        this.pageContent.intro_block = this.md.parse(this.pageContent?.intro_block);
        this.institutionResources = this.contentManager.getContentObj(institutionContent, this.contentBlock[0]);
        this.userResources = this.contentManager.getContentObj(userContent, this.contentBlock[1]);

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
