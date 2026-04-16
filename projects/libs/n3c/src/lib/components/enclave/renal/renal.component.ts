import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ViewEncapsulation} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-renal',
  templateUrl: './renal.component.html',
  styleUrl: './renal.component.scss',
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
export class N3cRenalComponent extends N3cBaseComponent implements OnInit {
  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) private configuration: Endpoints,
    public contentManager: ContentManagerService
  ) {
    super(configuration, strapiApi);
  }

  ngOnInit() {
    this.initDataByRoute({landingPage: true});
    this.titleService.setTitle('N3C - Renal');
  }
}
