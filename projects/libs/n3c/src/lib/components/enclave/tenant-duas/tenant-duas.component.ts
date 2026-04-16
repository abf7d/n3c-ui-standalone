import '../../../ag-grid-setup';
import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {AgGridAngular} from 'ag-grid-angular';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {ViewEncapsulation} from '@angular/core';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-tenant-duas',
  templateUrl: './tenant-duas.component.html',
  styleUrls: ['./tenant-duas.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
export class N3cTenantDuasPageComponent extends N3cBaseComponent implements OnInit {
  public frameworkComponents: any;
  public defaultColDef: any;
  public columnDefs: any;
  public rowData: any;
  public quickFilterMatch: any;
  private gridApi!: GridApi;
  public paginationPageSize: number;
  public paginationPageSizeSelector: any;

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private strapiApi: StrapiApiService,
    @Inject(API_URLS) private configuration: Endpoints
  ) {
    super(configuration, strapiApi);

    this.defaultColDef = {
      width: 200,
      sortable: true,
      resizable: true,
      cellStyle: {'border-bottom': '1px solid #ddd'}
    };

    this.columnDefs = [
      {
        field: 'site_name',
        headerName: 'Institution',
        headerComponentParams: {
          template:
            '<div class="ag-cell-label-container" role="presentation">' +
            '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '    <div>  <i class="fa fa-university" aria-hidden="true" style="color: #376076;font-size:large;"></i>&nbsp;<span ref="eText" class="ag-header-cell-text" role="columnheader" style="font-size: 16px;">Institution</span></div>' +
            '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
            '  </div>' +
            '</div>'
        },
        width: 600,
        sortable: true,
        sort: 'asc',
        sortIndex: 0
      },
      {
        field: 'contact',
        headerName: 'Local Contact',
        headerComponentParams: {
          template:
            '<div> <i class="fa fa-user" aria-hidden="true" style="color: #376076;font-size:large;"></i>&nbsp;<span style="color:#333; font-weight:600; font-size:16px;">Local Contact</span></div>'
        },
        width: 300
      },
      {
        field: 'date_executed',
        headerName: 'Date Executed',
        headerComponentParams: {
          template:
            '<div class="ag-cell-label-container" role="presentation">' +
            '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
            '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
            '    <div> <i class="fa fa-calendar" aria-hidden="true" style="color: #376076;font-size:large;"></i>&nbsp;<span ref="eText" class="ag-header-cell-text" role="columnheader" style="font-size: 16px;">Date Executed</span></div>' +
            '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
            '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
            '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
            '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
            '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
            '  </div>' +
            '</div>'
        },
        width: 300,
        sortable: true,
        flex: 1, // This line tells ag-Grid to make this column fill the remaining space
        cellFilter: 'date',
        type: 'date'
      }
    ];

    this.paginationPageSize = 25;
    this.paginationPageSizeSelector = [10, 25, 50, 100];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Data Use Agreements');
  }

  override onBaseDataLoaded(): void {
    const tenantDuaListEndpoint = this.strapiService.get<StrapiResult>('tenant-dua-list');
    const embeddedListEndpoint = this.http.get(
      `${this.configuration.n3cUrls.dashboardEndpoint}/embedded_tenant_dua_roster.jsp`
    );

    forkJoin([tenantDuaListEndpoint, embeddedListEndpoint]).subscribe({
      next: ([tenantResults, embeddedListResult]) => {
        this.pageContent = tenantResults?.data?.attributes || {};
        if (this.pageContent?.block1) {
          this.pageContent.block1 = this.md.parse(this.pageContent.block1);
        }
        this.rowData = embeddedListResult;
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
    this.gridApi.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    const embeddedListEndpoint = [this.configuration.n3cUrls.dashboardEndpoint, 'embedded_tenant_dua_roster.jsp'].join(
      '/'
    );
    this.http.get<any[]>(embeddedListEndpoint).subscribe((data) => (this.rowData = data));
  }
}
