import '../../../ag-grid-setup';
import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {DataDownloadApiService} from '../../../services/api/data-download-api/data-download-api.service';
import {GridApi} from 'ag-grid-community';
import {DetailCellRendererComponent} from '../admin-dashboard/detail-cell-renderer.component';
import {AgGridAngular} from 'ag-grid-angular';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';

import {DownloadCellRenderComponent} from './download-cell-renderer.component';
import {RouterModule} from '@angular/router';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-data-download',
  imports: [AgGridAngular, RouterModule, DashboardFooterComponent, HeaderViewComponent, N3cLoaderComponent],
  templateUrl: './data-download.component.html',
  styleUrl: './data-download.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DataDownloadComponent implements OnInit {
  public showError = false;
  public dataLoading = true;
  public columnDefs: any[] = [];
  private downloadData: any[] = [];
  public gridData: any[] = [];
  public defaultColDef: any;
  private gridApi!: GridApi;
  public frameworkComponents: any;
  private downloadApi = inject(DataDownloadApiService);
  ngOnInit(): void {
    const downloadData$ = this.downloadApi.getDownloads();
    this.frameworkComponents = {
      expandCellRenderer: DownloadCellRenderComponent
    };
    this.dataLoading = true;
    this.showError = false;
    downloadData$.subscribe({
      next: (data: any) => {
        this.downloadData = data;
        this.initColDefs(data);
        this.dataLoading = false;
        this.showError = false;
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.dataLoading = false;
        this.showError = true;
      }
    });
  }

  public onGridReady(params: any) {
    this.gridApi = params.api;
  }
  onFilterTextBoxChanged() {
    const value = (document.getElementById('filter-text-box') as HTMLInputElement).value;
    this.gridApi.setGridOption('quickFilterText', value);
  }
  private initColDefs(data: any) {
    this.defaultColDef = {
      width: 300,
      filter: true,
      sortable: true,
      resizable: true,
      cellStyle: {'border-bottom': '1px solid #ddd'}
    };

    this.gridData = data['rows'] ?? [];
    this.columnDefs = [
      {
        headerName: 'Category',
        field: 'category',
        flex: 9,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true
      },
      {
        headerName: 'File',
        field: 'file',
        flex: 15,
        wrapText: true,
        autoHeight: true
      },
      {
        headerName: 'Last Updated',
        field: 'updated',
        width: 160,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true,
        filter: false
      },
      {
        headerName: 'Row Count',
        field: 'row_count',
        flex: 5,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'ag-right-aligned-cell',
        type: 'rightAligned',
        filter: false
      },
      {
        headerName: 'Attributes',
        field: 'attributes',
        flex: 20,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true
      },
      {
        headerName: 'Download',
        field: 'json',
        cellRenderer: DownloadCellRenderComponent,
        width: 200,
        wrapText: true,
        autoHeight: true,
        wrapHeaderText: true,
        filter: false
      }
    ];
  }
}
