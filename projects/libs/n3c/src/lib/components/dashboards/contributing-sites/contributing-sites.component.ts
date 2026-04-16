import {Component, ElementRef, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {PopoverDirective} from '@odp/shared/lib/popover/popover.directive';
import {MapData, Site, SiteLocations, StateInfo} from '@odp/n3c/lib/models/admin-models';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {SitemapChartService} from '@odp/n3c/lib/services/charts/geo-map/site-map/site-map.service';
import {AlbersUSATerritoriesProjectionService} from '@odp/n3c/lib/services/charts/geo-map/base-geo-map/albers-usa-territories-projection';
import {GridApi} from 'ag-grid-community';
import saveAs from 'file-saver';
import {toJpeg, toPng, toSvg} from 'html-to-image';
import {forkJoin} from 'rxjs';
import {SiteCellRendererComponent} from './site-cell-renderer.component';

import {RouterModule} from '@angular/router';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {SimpleGridComponent} from '../../shared/simple-grid/simple-grid.component';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';

@Component({
  selector: 'app-contributing-sites',
  imports: [
    RouterModule,
    PopoverDirective,
    HeaderViewComponent,
    N3cLoaderComponent,
    SimpleGridComponent,
    DashboardFooterComponent
  ],
  providers: [SitemapChartService, AlbersUSATerritoriesProjectionService],
  templateUrl: './contributing-sites.component.html',
  styleUrl: './contributing-sites.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ContributingSitesComponent implements OnInit {
  dataLoading = true;
  showError = false;
  @ViewChild('chartMap', {static: true}) chartMap!: ElementRef;
  @ViewChild('colorLegend', {static: true}) colorLegend!: ElementRef;
  @ViewChild('siteLegend', {static: true}) siteLegend!: ElementRef;
  private countyLevelData: any;
  private mapCounties: any;
  public gridData: Site[] = [];
  private mapColors = {available: '#007bff', pending: '#8406D1', ochin: '#0b4865'};
  public columnDefs: any;
  public frameworkComponents: any;
  public states!: StateInfo;
  public mapData!: MapData;
  public ochinLocations!: SiteLocations;
  constructor(
    private siteMap: SitemapChartService,
    private siteApi: SitemapApiService
  ) {
    this.frameworkComponents = {
      datasourceRenderer: SiteCellRendererComponent
    };
  }
  ngOnInit() {
    const siteLocations$ = this.siteApi.getSiteLocations();
    const mapData$ = this.siteApi.getMapData();
    const states$ = this.siteApi.getStates();
    const ochinLocations$ = this.siteApi.getOchinLocations();
    const countyLevelDataReq$ = this.siteApi.getCountyLevelData();
    const mapCounties$ = this.siteApi.getMapCounties();

    this.dataLoading = true;
    this.showError = false;
    forkJoin([mapData$, states$, ochinLocations$, siteLocations$, countyLevelDataReq$, mapCounties$]).subscribe({
      next: ([mapData, states, ochinLocations, siteLocations, countyLevelDataReq, mapCounties]: [
        MapData,
        StateInfo,
        SiteLocations,
        SiteLocations,
        any,
        any
      ]) => {
        this.gridData = siteLocations.sites;
        this.ochinLocations = ochinLocations;
        this.mapData = mapData;
        this.states = states;
        this.initColDefs();
        this.countyLevelData = countyLevelDataReq.data;
        this.mapCounties = mapCounties;
        this.siteMap.init(0.6, false, this.mapColors, true);
        this.siteMap.draw(this.mapData, this.states, this.ochinLocations, siteLocations, this.chartMap.nativeElement);
        this.siteMap.drawCounties(this.countyLevelData, mapCounties);

        this.siteMap.drawContributingLegend(
          this.countyLevelData,
          this.colorLegend.nativeElement,
          this.siteLegend.nativeElement,
          'population',
          this.mapColors
        );
        this.dataLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.showError = true;
        this.dataLoading = false;
      }
    });
  }
  onViewChanged(event: any) {
    const value = event.target.value;
    const valid = ['population', 'birthrate', 'deathrate'];
    if (valid.indexOf(value) < 0) return;
    this.siteMap.drawCounties(this.countyLevelData, this.mapCounties, value);
    this.siteMap.drawContributingLegend(
      this.countyLevelData,
      this.colorLegend.nativeElement,
      this.siteLegend.nativeElement,
      value
    );
  }

  saveAs(format: string) {
    const element = this.chartMap.nativeElement;
    if (!element) return;

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => saveAs(dataUrl, `contributing-sites.jpg`));
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => saveAs(dataUrl, `contributing-sites.png`));
        break;
      case 'svg':
        toSvg(element).then((dataUrl) => saveAs(dataUrl, `contributing-sites.svg`));
        break;
    }
  }

  private initColDefs() {
    this.columnDefs = [
      {
        field: 'site',
        headerName: 'Site',
        flex: 3,
        filter: true,
        sortable: true,
        resizable: true,
        cellRenderer: 'datasourceRenderer'
      },
      {
        field: 'type',
        headerName: 'Type',
        flex: 1,
        filter: true,
        sortable: true,
        resizable: true
      },
      {
        field: 'status',
        headerName: 'Data Status',
        flex: 1,
        filter: true,
        resizable: true
      },
      {
        field: 'data_model',
        headerName: 'Data Model',
        width: 185,
        filter: true,
        sortable: true,
        resizable: true
      }
    ];
  }

  public resetZoom() {
    this.siteMap.resetZoom();
  }

  onDisplayedRowsChange(filtered: Site[]) {
    this.siteMap.drawCircles(filtered, this.mapColors);
  }
}

export interface MapColors {
  available: string;
  pending: string;
  ochin: string;
}
