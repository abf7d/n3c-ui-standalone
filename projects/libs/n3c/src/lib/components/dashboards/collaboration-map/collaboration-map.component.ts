import '../../../ag-grid-setup';

import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BaseGeoMapService} from '@odp/n3c/lib/services/charts/geo-map/base-geo-map/base-geo-map.service';
import {AlbersUSATerritoriesProjectionService} from '@odp/n3c/lib/services/charts/geo-map/base-geo-map/albers-usa-territories-projection';
import {CollaboratingSitesService} from '@odp/n3c/lib/services/charts/geo-map/collaborating-sites/collaborating-sites.service';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {CollaborationMapApiService} from '@odp/n3c/lib/services/api/collaboration-map-api/collaboration-map-api.service';
import {ColDef, GridApi} from 'ag-grid-community';
import {saveAs} from 'file-saver';
import {colDefs} from './constants';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {forkJoin} from 'rxjs';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {
  SiteCollaborationLegend,
  SiteCollaboration,
  SiteCollaborations,
  SiteCollaborationLegends
} from './collaboration-map.interface';
import {AgGridAngular} from 'ag-grid-angular';
import {MapFilterLegendComponent} from './map-filter-legend.component';
import {SiteCellRendererComponent} from '../contributing-sites/site-cell-renderer.component';
import {DetailsLinkComponent} from '../publications-map/details-link.component';
import {SitePublicationsComponent} from '../site-publications/site-publications.component';

@Component({
  selector: 'app-n3c-collaboration-map',
  imports: [
    DashboardFooterComponent,
    HeaderViewComponent,
    RouterModule,
    N3cLoaderComponent,
    AgGridAngular,
    MapFilterLegendComponent,
    SitePublicationsComponent
  ],
  providers: [BaseGeoMapService, CollaboratingSitesService, AlbersUSATerritoriesProjectionService],
  templateUrl: './collaboration-map.component.html',
  styleUrl: './collaboration-map.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CollaborationMapComponent implements OnInit {
  @ViewChild('chart', {static: true}) chart!: ElementRef;
  public frameworkComponents = {
    datasourceRenderer: SiteCellRendererComponent,
    detailsLink: DetailsLinkComponent
  };
  public columnDefs: ColDef[] = [];
  public gridData: SiteCollaboration[] = [];
  public filteredData: SiteCollaboration[] = [];
  public legends: SiteCollaborationLegend[] = [];
  public activeLegendFilters: string[] = [];
  private gridApi!: GridApi;
  public showError = false;
  public dataLoading = true;
  public showTooltip = false;
  public showMenu = false;
  public ror = '';

  private allCollaborations!: SiteCollaborations;
  private allEdges!: any;
  private regions!: any;

  public title = 'Inter-institutional Collaboration Map';
  public description = `Collaborative team science is central to the N3C's mission. Below you can find a map of institutions with
        members working within the N3C Data Enclave sized by their number of collaborative members. Links represent
        collaborations between at least one member from each institution. The darker the link, the more collaborators.`;

  constructor(
    private collab: CollaboratingSitesService,
    private geoMap: BaseGeoMapService,
    private collabMapApi: CollaborationMapApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.ror = params.get('ror') || '';

      if (this.ror) {
        this.dataLoading = false;
        return;
      }

      if (!this.regions) this.loadData();
    });
  }

  private loadData() {
    const regions$ = this.collabMapApi.getRegions();
    const collaborations$ = this.collabMapApi.getSiteData();
    const edges$ = this.collabMapApi.getEdges();
    const legends$ = this.collabMapApi.getLegends();

    forkJoin([regions$, collaborations$, edges$, legends$]).subscribe({
      next: ([regions, collaborations, edges, legends]: [any, SiteCollaborations, any, SiteCollaborationLegends]) => {
        this.initColDefs();

        this.allCollaborations = collaborations;
        this.allEdges = edges;
        this.regions = regions;
        this.legends = legends.sites;
        this.activeLegendFilters = this.legends.map((l) => l.org_type);

        const geoMap = this.geoMap.draw(regions, this.chart.nativeElement);
        this.collab.draw(geoMap.svg, geoMap.projection, collaborations, edges);
        this.gridData = collaborations.sites;
        this.filteredData = this.gridData;
        this.dataLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.showError = true;
        this.dataLoading = false;
      }
    });
  }

  public toggleTooltip() {
    this.showTooltip = !this.showTooltip;
  }

  protected initColDefs() {
    this.columnDefs = colDefs;
  }

  public downloadCsv() {
    this.gridApi.exportDataAsCsv();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onFilterTextBoxChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.gridApi.setGridOption('quickFilterText', value);
  }

  public saveAs(format: string) {
    const element = this.chart.nativeElement;

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => {
          saveAs(dataUrl, `${this.title}.jpg`);
        });
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => {
          saveAs(dataUrl, `${this.title}.png`);
        });
        break;
      case 'svg':
        toSvg(element).then((dataUrl) => {
          saveAs(dataUrl, `${this.title}.svg`);
        });
        break;
    }
  }

  public onGridReady(params: any) {
    this.gridApi = params.api;
  }

  public onGridFilterChanged() {
    if (!this.gridApi) return;

    const displayedSites: SiteCollaboration[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort((node) => {
      if (node.data) displayedSites.push(node.data);
    });
    this.redrawMap(displayedSites);
  }

  private redrawMap(filteredData: SiteCollaboration[]) {
    // Remove old SVG/map
    this.chart.nativeElement.innerHTML = '';

    const geoMap = this.geoMap.draw(this.regions, this.chart.nativeElement);
    const filteredCollaborations = this.allCollaborations;
    filteredCollaborations.sites = filteredData;

    // NOTE: it doesn't filter edges, only collaborations
    this.collab.draw(geoMap.svg, geoMap.projection, filteredCollaborations, this.allEdges);
  }

  onLegendFilterChange(selectedOrgTypes: string[]) {
    this.activeLegendFilters = selectedOrgTypes;

    if (this.activeLegendFilters.length === 0) {
      this.filteredData = this.gridData;
    } else {
      this.filteredData = this.gridData.filter((site) => this.activeLegendFilters.includes(site.type));
    }

    this.redrawMap(this.filteredData);
  }
}
