import {Component, inject, OnInit} from '@angular/core';
import {GridComponent} from '../../shared/data-grid/data-grid.component';
import {ColDef, GridOptions} from 'ag-grid-community';
import {ConceptSet, ConceptSets} from './concept-sets.interface';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {RouterModule} from '@angular/router';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {ExternalLinkComponent} from '../../shared/external-link/external-link.component';
import {HttpClient} from '@angular/common/http';
import {DoiLinkComponent} from './doi-link.component';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';

@Component({
  selector: 'app-concept-sets',
  imports: [
    GridComponent,
    DashboardFooterComponent,
    HeaderViewComponent,
    RouterModule,
    N3cLoaderComponent,
    ExternalLinkComponent
  ],
  templateUrl: './concept-sets.component.html',
  styleUrl: './concept-sets.component.scss'
})
export class ConceptSetsComponent implements OnInit {
  public frameworkComponents = {
    doiLink: DoiLinkComponent
  };

  private http = inject(HttpClient);
  private config = inject(API_URLS) as unknown as Endpoints;
  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

  public columnDefs: ColDef[] = [];
  public gridData: ConceptSet[] = [];
  public showError = false;
  public dataLoading = true;
  public gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 5,
    components: this.frameworkComponents,
    paginationPageSizeSelector: [5, 10, 25, 50, 75, 100],
    quickFilterText: '',
    domLayout: 'autoHeight',
    enableCellTextSelection: true,
    context: {
      showSearchBox: true,
      searchBoxWidth: '400px'
    }
  };

  public title = 'N3C Concept Sets';
  public description = 'The officially recommended set of concepts in use in the Enclave.';

  ngOnInit(): void {
    this.http.get<ConceptSets>(`${this.baseUrl}/zenodo`).subscribe({
      next: (data) => {
        this.initColDefs();

        this.gridData = data.rows;
        this.dataLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.showError = true;
        this.dataLoading = false;
      }
    });
  }

  private initColDefs() {
    this.columnDefs = [
      {
        field: 'type',
        headerName: 'Type',
        flex: 3,
        filter: 'agTextColumnFilter',
        resizable: true,
        wrapText: true,
        autoHeight: true
      },
      {
        field: 'title',
        headerName: 'Title',
        flex: 4,
        sortable: true,
        filter: 'agTextColumnFilter',
        wrapText: true,
        autoHeight: true,
        resizable: true
      },
      {
        field: 'codeset_id',
        headerName: 'Codeset ID',
        flex: 4,
        filter: 'agTextColumnFilter',
        resizable: true,
        wrapText: true,
        autoHeight: true
      },
      {
        field: 'doi',
        headerName: 'DOI',
        flex: 7,
        filter: 'agTextColumnFilter',
        resizable: true,
        wrapText: true,
        autoHeight: true,
        cellRenderer: 'doiLink'
      },
      {
        field: 'created_by',
        headerName: 'Created By',
        flex: 3,
        filter: 'agTextColumnFilter',
        resizable: true,
        wrapText: true,
        autoHeight: true
      },
      {
        field: 'creator',
        headerName: 'Creator',
        flex: 3,
        filter: 'agTextColumnFilter',
        resizable: true,
        wrapText: true,
        autoHeight: true
      },
      {
        field: 'limitations',
        headerName: 'Limitations',
        flex: 9,
        filter: 'agTextColumnFilter',
        resizable: true,
        wrapText: true,
        autoHeight: true
      },
      {
        field: 'published',
        headerName: 'Published',
        flex: 4,
        filter: 'agTextColumnFilter',
        resizable: true,
        wrapText: true,
        autoHeight: true
      }
    ];
  }
}
