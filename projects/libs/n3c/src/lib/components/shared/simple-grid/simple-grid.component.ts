import '../../../ag-grid-setup';
import {Component, Input, Output, EventEmitter} from '@angular/core';

import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, CsvExportParams, GridApi, GridReadyEvent} from 'ag-grid-community';

@Component({
  selector: 'app-simple-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './simple-grid.component.html',
  styleUrls: ['./simple-grid.component.scss']
})
export class SimpleGridComponent {
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {resizable: true, sortable: true, filter: true};
  @Input() autoHeight = true;
  @Input() gridHeight = '420px';
  @Input() searchPlaceholder = 'Filter...';
  @Input() showSearch = true;
  @Input() showDownload = true;
  @Input() csvFileName = 'data.csv';
  @Input() csvParams: CsvExportParams | undefined;
  @Input() components: any;
  @Output() displayedRowsChange = new EventEmitter<any[]>();

  paginationPageSize = 10;
  paginationPageSizeSelector: number[] = [10, 25, 50, 100];

  private gridApi!: GridApi;

  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api as GridApi;
    this.gridApi.addEventListener('modelUpdated', () => this.emitDisplayedRows());
    this.emitDisplayedRows();
  }

  onFilterInput(e: Event) {
    const v = (e.target as HTMLInputElement)?.value ?? '';
    if (!this.gridApi) return;
    this.gridApi.setGridOption('quickFilterText', v);
    this.emitDisplayedRows();
  }

  downloadCsv() {
    if (!this.gridApi) return;
    const params: CsvExportParams = {fileName: this.csvFileName, ...(this.csvParams || {})};
    this.gridApi.exportDataAsCsv(params);
  }

  private emitDisplayedRows() {
    if (!this.gridApi) return;
    const out: any[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort((n) => {
      if (n.data) out.push(n.data);
    });
    this.displayedRowsChange.emit(out);
  }
}
