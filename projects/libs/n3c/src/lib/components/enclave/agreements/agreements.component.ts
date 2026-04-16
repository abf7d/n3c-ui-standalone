import '../../../ag-grid-setup';
import {Component, OnInit, Inject} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {forkJoin} from 'rxjs';
import {ViewEncapsulation} from '@angular/core';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {AgGridAngular} from 'ag-grid-angular';
import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {StrapiApiService} from '../../../services/api/strapi-api/strapi-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {AgreementApiService} from '../../../services/api/agreement-api/agreement-api.service';
import {FormsModule} from '@angular/forms';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-agreements',
  templateUrl: './agreements.component.html',
  styleUrl: './agreements.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    AgGridAngular,
    N3cLoaderComponent,
    FormsModule,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cAgreementsComponent extends N3cBaseComponent implements OnInit {
  public output: any;
  public frameworkComponents: any;
  public defaultColDef: any;
  public columnDefs: any;
  public rowData: any;
  public allRows: any;
  public quickFilterMatch: any;
  private gridApi!: GridApi;
  public paginationPageSize: number;
  public paginationPageSizeSelector: any;
  public agreementTypes: string[] = [];
  public tenantGroups: string[] = [];
  public selectedTenant = 'all';
  public selectedAgreementType = 'all';

  constructor(
    private titleService: Title,
    private strapiApi: StrapiApiService,
    private agreementApi: AgreementApiService,
    private route: ActivatedRoute,
    private router: Router,
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
        field: 'ror_id',
        headerName: 'ROR ID',
        width: 600,
        sortable: true,
        flex: 1,
        sort: 'asc',
        sortIndex: 0
      },
      {
        field: 'ror_name',
        headerName: 'ROR Name',
        flex: 1,
        width: 300,
        sortable: true
      },
      {
        field: 'date_executed',
        headerName: 'Date Executed',
        width: 300,
        sortable: true,
        valueFormatter: (params: any) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString();
        }
      }
    ];

    this.paginationPageSize = 10;
    this.paginationPageSizeSelector = [10, 25, 50, 100];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - Data Use Agreements');
  }

  override onBaseDataLoaded(): void {
    this.route.queryParams.subscribe((params) => {
      const agreementType = params['type'];
      const tenant = params['tenant'];
      const duaListEndpoint = this.strapiApi.get<StrapiResult>('dua-list');
      const agreements$ = this.agreementApi.getAgreements();
      const tenantGroups$ = this.agreementApi.getTenantGroups();
      const agreementTypes$ = this.agreementApi.getAgreementTypes();

      forkJoin([duaListEndpoint, agreements$, tenantGroups$, agreementTypes$]).subscribe({
        next: ([dualListResult, agreements, tenantGroups, agreementTypes]) => {
          this.pageContent = dualListResult.data?.attributes || {};
          this.rowData = agreements;
          this.allRows = agreements;

          this.pageContent.block1 = this.md.parse(this.pageContent?.block1);
          this.tenantGroups = tenantGroups.filter((x) => !!x);
          this.agreementTypes = agreementTypes.filter((x) => !!x);
          if (!!this.agreementTypes.find((x) => x.toLowerCase() === agreementType?.toLowerCase())) {
            this.filterAgrementType(agreementType);
          }
          if (!!this.tenantGroups.find((x) => x.toLowerCase() === tenant?.toLowerCase())) {
            this.filterTenantGroup(tenant);
          }
          this.dataLoading = false;
        },
        error: (error) => {
          this.showError = true;
          console.error('Error loading data', error);
          this.dataLoading = false;
        }
      });
    });
  }

  filterAgrementTypeChange(type: string) {
    this.router.navigate([], {queryParams: {type: type, tenant: this.selectedTenant}});
  }
  filterAgrementType(type: string) {
    this.selectedAgreementType = type;
    let rowData = this.allRows;
    if (type === 'all') {
      if (this.selectedTenant !== 'all') {
        rowData = this.allRows.filter((x: any) => x.group_name.toLowerCase() === this.selectedTenant.toLowerCase());
      }
      this.rowData = rowData;
      return;
    }
    if (this.selectedTenant === 'all') {
      this.rowData = this.allRows.filter((x: any) => x.agreement_type.toLowerCase() === type.toLowerCase());
      return;
    }

    this.rowData = this.allRows
      .filter((x: any) => x.agreement_type.toLowerCase() === type.toLowerCase())
      .filter((x: any) => x.group_name.toLowerCase() === this.selectedTenant.toLowerCase());
  }
  filterTenantGroupChange(type: string) {
    this.router.navigate([], {queryParams: {type: this.selectedAgreementType, tenant: type}});
  }
  filterTenantGroup(type: string) {
    this.selectedTenant = type;
    let rowData = this.allRows;
    if (type === 'all') {
      if (this.selectedAgreementType !== 'all') {
        rowData = this.allRows.filter(
          (x: any) => x.agreement_type.toLowerCase() === this.selectedAgreementType.toLowerCase()
        );
      }
      this.rowData = rowData;
      return;
    }
    if (this.selectedAgreementType === 'all') {
      this.rowData = this.allRows.filter((x: any) => x.group_name.toLowerCase() === type.toLowerCase());
      return;
    }

    this.rowData = this.allRows
      .filter((x: any) => x.agreement_type.toLowerCase() === this.selectedAgreementType.toLowerCase())
      .filter((x: any) => x.group_name.toLowerCase() === type.toLowerCase());
  }

  onFilterTextBoxChanged() {
    this.gridApi.setGridOption(
      'quickFilterText',
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
