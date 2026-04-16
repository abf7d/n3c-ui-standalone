import '../../../ag-grid-setup';
import {Component, ViewEncapsulation} from '@angular/core';
import {CollaborationMapComponent} from '../collaboration-map/collaboration-map.component';
import {CollaboratingSitesService} from '@odp/n3c/lib/services/charts/geo-map/collaborating-sites/collaborating-sites.service';
import {BaseGeoMapService} from '@odp/n3c/lib/services/charts/geo-map/base-geo-map/base-geo-map.service';
import {AlbersUSATerritoriesProjectionService} from '@odp/n3c/lib/services/charts/geo-map/base-geo-map/albers-usa-territories-projection';
import {CommonModule} from '@angular/common';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {AgGridAngular} from 'ag-grid-angular';
import {MapFilterLegendComponent} from '../collaboration-map/map-filter-legend.component';
import {PublicationsMapApiService} from '@odp/n3c/lib/services/api/publications-map-api/publications-map-api.service';
import {SitePublicationsComponent} from '../site-publications/site-publications.component';

@Component({
  selector: 'app-publications-map',
  templateUrl: '../collaboration-map/collaboration-map.component.html',
  styleUrl: '../collaboration-map/collaboration-map.component.scss',
  imports: [
    CommonModule,
    DashboardFooterComponent,
    HeaderViewComponent,
    RouterModule,
    N3cLoaderComponent,
    AgGridAngular,
    MapFilterLegendComponent,
    SitePublicationsComponent
  ],
  providers: [BaseGeoMapService, CollaboratingSitesService, AlbersUSATerritoriesProjectionService],
  encapsulation: ViewEncapsulation.None
})
export class PublicationsMapComponent extends CollaborationMapComponent {
  override title = 'Inter-institutional Publication Map';
  override description = `Collaborative team science is central to the N3C's mission. Below you can
    find a map of institutions with investigators coauthoring publications
    involving N3C data. Links represent collaborations between at least one
    author from each institution. The darker the link, the more authors.`;

  constructor(
    protected collabPub: CollaboratingSitesService,
    protected geoMapPub: BaseGeoMapService,
    protected pubMapApi: PublicationsMapApiService,
    protected activatedRoutePub: ActivatedRoute
  ) {
    super(collabPub, geoMapPub, pubMapApi, activatedRoutePub);
  }

  override initColDefs() {
    this.columnDefs = [
      {
        field: 'site',
        headerName: 'Site',
        flex: 8,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true,
        cellRenderer: 'datasourceRenderer'
      },
      {field: 'type', headerName: 'Type', flex: 4, filter: 'agTextColumnFilter', resizable: true},
      {
        field: 'count',
        headerName: 'Author Count',
        flex: 4,
        filter: 'agTextColumnFilter',
        resizable: true,
        cellStyle: {'text-align': 'right'}
      },
      {
        field: 'aggregate_count',
        headerName: 'Authorship Count',
        flex: 4,
        filter: 'agTextColumnFilter',
        resizable: true,
        cellStyle: {'text-align': 'right'}
      },
      {
        field: 'target_count',
        headerName: 'Publication Count',
        flex: 4,
        filter: 'agTextColumnFilter',
        resizable: true,
        cellStyle: {'text-align': 'right'}
      },
      {
        field: 'id',
        headerName: 'Details',
        flex: 2,
        resizable: true,
        cellRenderer: 'detailsLink'
      }
    ];
  }
}
