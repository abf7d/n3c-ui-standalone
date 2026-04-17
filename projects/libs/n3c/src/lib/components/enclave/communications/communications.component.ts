import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ViewEncapsulation} from '@angular/core';
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
  selector: 'app-n3c-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss'],
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
export class N3cCommunicationsComponent extends N3cBaseComponent implements OnInit {
  objectTools: any;

  private titleService = inject(Title);
  public contentManager = inject(ContentManagerService);
  private route = inject(ActivatedRoute);

  constructor() {
    super();
    this.contentBlock = ['content_image_block_rights'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Communications');
  }

  override onBaseDataLoaded(): void {
    this.strapiService.get<StrapiResult>('communication-material', this.contentBlock).subscribe({
      next: (result) => {
        this.pageContent = result.data?.attributes || {};
        this.pageContent.block = this.md.parse(this.pageContent?.block);
        this.pageLabel = this.pageContent.header;
        this.contentResources = this.contentManager.getContentObj(this.pageContent, this.contentBlock[0]);

        // Assign PDF paths manually to each content resource
        const basePdfurl = 'https://opendata.ncats.nih.gov/public/odp/n3c/';

        // This needs to be dynamic
        const pdfFiles = [
          'N3C_Communications_Guidance_Revised-6.25.2021.pdf',
          'N3C_CTSA_Program_Stakeholder_Toolkit_Revised_1.11.2021b.pdf',
          'N3C_Webpage_Builder_Tools_for_Organizations.pdf',
          'Newsletter_Template_for_Organizations.pdf'
        ];

        if (this.contentResources && this.contentResources.length) {
          this.contentResources.forEach((resource: any, index: number) => {
            if (index < pdfFiles.length) {
              resource.pdfPath = basePdfurl + pdfFiles[index];
            }
          });
        }
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
