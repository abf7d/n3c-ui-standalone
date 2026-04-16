import '../../../ag-grid-setup';
import {Component, OnInit, Inject, ElementRef, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {forkJoin} from 'rxjs';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {CellRendererComponent} from './cellrenderer/cell-renderer.component';
import {Project} from './projects.interface';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {ProjectApiService} from '@odp/n3c/lib/services/api/project-api/project-api.service';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    AgGridAngular,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cProjectsPageComponent extends N3cBaseComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  public defaultColDef: any;
  public rowData: Project[] = [];
  private gridApi!: GridApi;
  public paginationPageSize: number;
  public paginationPageSizeSelector: number[];

  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'project',
      filter: true,
      cellRenderer: 'cellRenderer',
      autoHeight: true,
      flex: 1,
      cellRendererParams: (params: any) => ({
        data: params.data
      }),
      getQuickFilterText: (params) => {
        const data = params.data;
        return [data.title, data.pi_name, data.accessing_institution, data.uid, data.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
      }
    }
  ];

  getRowStyle = () => {
    return {background: '#fafafa'};
  };

  frameworkComponents = {
    cellRenderer: CellRendererComponent
  };

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    private projectApi: ProjectApiService,
    @Inject(API_URLS) private configuration: Endpoints
  ) {
    super(configuration, strapiApi);

    this.defaultColDef = {
      width: 200,
      sortable: true,
      resizable: true,
      cellStyle: {'border-bottom': '1px solid #ddd'}
    };

    this.paginationPageSize = 10;
    this.paginationPageSizeSelector = [10, 25, 50, 100];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Data Enclave Projects');
  }

  override onBaseDataLoaded(): void {
    const projectRequest = this.strapiApi.get<StrapiResult>('project');
    const embeddedProjectRequest = this.projectApi.getEmbeddedProjectRoster();

    forkJoin([projectRequest, embeddedProjectRequest]).subscribe({
      next: ([projectResult, embeddedResult]) => {
        this.pageContent = projectResult?.data?.attributes || {};

        let data: any;
        data = embeddedResult;
        let columnDefMap = new Map();

        // Getting headers
        for (let i = 0; i < data.headers.length; i++) {
          let item = data.headers[i];
          columnDefMap.set(item.value, item.label);
        }

        // Getting rows
        this.rowData = data.rows;
        this.dataLoading = false;
      },
      error: (error) => {
        this.showError = true;
        console.error('Error loading data', error);
        this.dataLoading = false;
      }
    });
  }

  // Quick search filter
  onFilterTextBoxChanged() {
    const input = this.searchInput.nativeElement.value || '';
    this.gridApi.setGridOption('quickFilterText', input);
    this.gridApi.onFilterChanged();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
