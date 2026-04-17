import '../../../ag-grid-setup';
import {Component, ElementRef, inject, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {SitemapChartService} from '../../../services/charts/geo-map/site-map/site-map.service';
import {AlbersUSATerritoriesProjectionService} from '../../../services/charts/geo-map/base-geo-map/albers-usa-territories-projection';
import {SitemapApiService} from '../../../services/api/site-map-api/site-map-api.service';
import {forkJoin} from 'rxjs';
import {DuaLineChartService} from '../../../services/charts/dua-line/dua-line.service';
import {InstitutionLineChartService} from '../../../services/charts/dua-line/institutions_line.server';
import {AgGridAngular} from 'ag-grid-angular';
import {FirstDataRenderedEvent, GridApi} from 'ag-grid-community';
import {DetailCellRendererComponent} from './detail-cell-renderer.component';
import {CommonModule} from '@angular/common';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {saveAs} from 'file-saver';
import {RouterModule} from '@angular/router';
import {ModuleRegistry, AllCommunityModule} from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import {
  AdminFactSheet,
  AdminInstCount,
  AdminUserCount,
  CurrentNotes,
  CurrentRelease,
  DomainTeamData,
  DuaEntry,
  MapData,
  RoseterData,
  SiteLocations,
  StateInfo
} from '../../../models/admin-models';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {LongCompactNumberPipe} from '@odp/n3c/lib/pipes/long-compact-number.pipe';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    AgGridAngular,
    CommonModule,
    DashboardFooterComponent,
    RouterModule,
    HeaderViewComponent,
    N3cLoaderComponent,
    LongCompactNumberPipe
  ],
  providers: [
    DuaLineChartService,
    InstitutionLineChartService,
    SitemapChartService,
    AlbersUSATerritoriesProjectionService
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('chart', {static: true}) chart!: ElementRef;
  @ViewChild('lineChart', {static: true}) lineChart!: ElementRef;
  @ViewChild('instLineChart', {static: true}) instLineChart!: ElementRef;
  public detailCellRenderer: any = DetailCellRendererComponent;
  public showError = false;
  public dataLoading = true;
  public columnDefs: any[] = [];
  public columnSiteDefs: any[] = [];
  public gridData: any[] = [];
  public gridProjectsData: any[] = [];
  public gridSiteData: any[] = [];
  private gridApi!: GridApi;
  private gridSiteApi!: GridApi;
  private gridProjectsApi!: GridApi;
  public frameworkComponents: any;
  public defaultColDef: any;

  public metricsView: 'users' | 'institutions' = 'institutions';
  public instView: 'map' | 'table' = 'map';
  public groupView: 'domain-teams' | 'projects' = 'domain-teams'; // Default view for the group section
  public showInfoPanel = false;
  public adminInstCount!: AdminInstCount;
  public adminUserCount!: AdminUserCount;
  public currentRelease!: CurrentRelease;
  public currentNotes!: CurrentNotes;

  private siteMap = inject(SitemapChartService);
  private siteApi = inject(SitemapApiService);
  private duaLine = inject(DuaLineChartService);
  private instLine = inject(InstitutionLineChartService);

  ngOnInit(): void {
    const mapData$ = this.siteApi.getMapData();
    const states$ = this.siteApi.getStates();
    const ochinLocations$ = this.siteApi.getOchinLocations();
    const siteLocations$ = this.siteApi.getSiteLocations();
    const duaData$ = this.siteApi.getDuaData();
    const domainTeams$ = this.siteApi.getDomainTeams();
    const projectRoster$ = this.siteApi.getProjectRoster();
    const currentRelease$ = this.siteApi.getFactSheetCurrentRelease();
    const currentNotes$ = this.siteApi.getFactSheetCurrentNotes();
    const adminInst$ = this.siteApi.adminInstitutions();
    const adminUser$ = this.siteApi.adminUsers();
    this.frameworkComponents = {
      expandCellRenderer: DetailCellRendererComponent
    };
    this.dataLoading = true;
    this.showError = false;
    forkJoin([
      mapData$,
      states$,
      ochinLocations$,
      siteLocations$,
      duaData$,
      domainTeams$,
      projectRoster$,
      adminInst$,
      adminUser$,
      currentRelease$,
      currentNotes$
    ]).subscribe(
      ([
        mapData,
        states,
        ochinLocations,
        siteLocations,
        duaData,
        domainTeams,
        projectRoster,
        adminInst,
        adminUser,
        currentRelease,
        currentNotes
      ]: [
        MapData,
        StateInfo,
        SiteLocations,
        SiteLocations,
        DuaEntry[],
        DomainTeamData,
        RoseterData,

        AdminInstCount,
        AdminUserCount,
        CurrentRelease,
        CurrentNotes
      ]) => {
        this.siteMap.draw(mapData, states, ochinLocations, siteLocations, this.chart.nativeElement);
        this.siteMap.drawAdminLegend();
        this.duaLine.draw(duaData, this.lineChart.nativeElement);
        this.instLine.draw(duaData, this.instLineChart.nativeElement);
        this.initColDefs(domainTeams);
        this.initSiteColDefs(siteLocations);
        this.initProjColDefs(projectRoster);

        this.dataLoading = false;
        this.adminInstCount = adminInst;
        this.adminUserCount = adminUser;
        this.currentRelease = currentRelease;
        this.currentNotes = currentNotes;
      },
      (error) => {
        console.error(error);
        this.showError = true;
        this.dataLoading = false;
      }
    );
  }
  public onGridReady(params: any) {
    this.gridApi = params.api;
  }
  public onProjectsGridReady(params: any) {
    this.gridProjectsApi = params.api;
  }
  public onSiteGridReady(params: any) {
    this.gridSiteApi = params.api;
  }
  onFilterTextBoxChanged() {
    const value = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.gridApi.setGridOption('quickFilterText', value);
  }
  onFilterProjectsTextBoxChanged() {
    const value = (document.getElementById('filter-projects-text-box') as HTMLInputElement).value;
    this.gridProjectsApi.setGridOption('quickFilterText', value);
  }
  onFilterSiteTextBoxChanged() {
    const value = (document.getElementById('filter-site-text-box') as HTMLInputElement).value;
    this.gridSiteApi.setGridOption('quickFilterText', value);
  }
  private initProjColDefs(data: any) {
    this.gridProjectsData = data['rows'] ?? [];
    this.defaultColDef = {
      width: 200,
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: {'border-bottom': '1px solid #ddd'}
    };
    this.columnDefs = [
      {
        field: 'title',
        width: 550,
        cellRenderer: 'expandCellRenderer',
        wrapText: true,
        autoHeight: true
      },
      {field: 'description', hide: true},
      {field: 'created', hide: true},
      {field: 'url', hide: true}
    ];
  }
  public getSiteLink = (params: any) => {
    return `<a target="_blank" href="${params.data.url}">${params.data.site}</a>`;
  };
  private initSiteColDefs(data: any) {
    this.defaultColDef = {
      width: 300,
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: {'border-bottom': '1px solid #ddd'}
    };

    this.gridSiteData = data['sites'] ?? [];
    this.columnSiteDefs = [
      {
        headerName: 'Site',
        field: 'site',
        width: 275,
        cellRenderer: this.getSiteLink,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true,
        autoHeaderHeight: true
      },
      {
        headerName: 'Type',
        field: 'type',
        width: 105,
        wrapText: true,
        autoHeight: true
      },
      {
        headerName: 'Data Status',
        field: 'status',
        width: 95,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true,
        autoHeaderHeight: true
      },
      {
        headerName: 'Data Model',
        field: 'data_model',
        width: 100,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true,
        autoHeaderHeight: true
      }
    ];
  }
  private initColDefs(data: any) {
    this.defaultColDef = {
      width: 200,
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: {'border-bottom': '1px solid #ddd'}
    };

    this.gridData = data['rows'] ?? [];
    this.columnDefs = [
      {
        field: 'title',
        width: 550,
        cellRenderer: 'expandCellRenderer',
        wrapText: true,
        autoHeight: true
      },
      {field: 'description', hide: true},
      {field: 'created', hide: true},
      {field: 'url', hide: true}
    ];
  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.forEachNode(function (node) {
      node.setExpanded(node.id === '1');
    });
  }
  saveAs(format: string, chartType: 'users' | 'institutions', title: string) {
    const element = chartType === 'users' ? this.lineChart.nativeElement : this.instLineChart.nativeElement;
    if (!element) return;

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => saveAs(dataUrl, `${title}.jpg`));
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => saveAs(dataUrl, `${title}.png`));
        break;
      case 'svg':
        toSvg(element).then((dataUrl) => saveAs(dataUrl, `${title}.svg`));
        break;
    }
  }
  onBtnExport(type: 'site' | 'projects' | 'data') {
    if (type === 'site' && this.gridSiteApi) {
      this.gridSiteApi.exportDataAsCsv({allColumns: true});
    } else if (type === 'projects' && this.gridProjectsApi) {
      this.gridProjectsApi.exportDataAsCsv({allColumns: true});
    } else if (type === 'data' && this.gridApi) {
      this.gridApi.exportDataAsCsv({allColumns: true});
    }
  }
}
