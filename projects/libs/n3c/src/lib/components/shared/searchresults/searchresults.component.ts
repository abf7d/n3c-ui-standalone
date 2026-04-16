import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, Inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Router, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '@odp/n3c/lib/services/api/strapi-api/strapi-api.service';

@Component({
  selector: 'app-about',
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule, N3cMenuComponent, HeaderViewComponent]
})
export class N3CSearchResultsComponent extends N3cBaseComponent implements OnInit {
  tiles: any[] = [];
  searchTerm: string = '';

  constructor(
    protected strapiApi: StrapiApiService,
    @Inject(API_URLS) configuration: Endpoints,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(configuration, strapiApi);
  }

  ngOnInit(): void {
    const navigation = this.router.currentNavigation();
    this.tiles = history.state.tiles || [];

    this.route.params.subscribe((params) => {
      this.searchTerm = params['searchTerm'];
    });
  }
}
