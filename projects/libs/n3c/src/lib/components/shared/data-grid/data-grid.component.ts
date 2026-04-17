import '../../../ag-grid-setup';
import {Component, inject, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';

import {GridApi, GridReadyEvent} from 'ag-grid-community';
import {FormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  imports: [AgGridAngular, FormsModule, MatSnackBarModule]
})
export class GridComponent implements OnInit, OnChanges {
  @Input() rowData: any[] = [];
  @Input() columnDefs: any[] = [];
  @Input() gridOptions: any;
  private gridApi!: GridApi;
  public searchTerm: string = '';
  public rowCount: number = 0;

  private snackBar = inject(MatSnackBar);

  /**
   * Example column definitions to pass into the data grid.
   *
   * Example usage:
   * ```typescript
   * columnDefs = [
   *   { field: 'race', headerName: 'Race', width: 150, sortable: true, resizable: true },
   *   { field: 'ethnicity', headerName: 'Ethnicity', width: 150, filter: true, resizable: true },
   * ];
   * ```
   *
   * - `field`: The field name from the data object to display in the column.
   * - `headerName`: The column header text.
   * - `width`: The column width in pixels.
   * - `sortable`: If true, enables sorting for the column.
   * - `filter`: If true, enables filtering for the column.
   * - `resizable`: If true, allows the column to be resized.
   */

  /**
   * Customizable grid options.
   * Example usage:
   * ```typescript
   * public gridOptions = {
   *   headerHeight: 80,
   *   pagination: true,
   *   paginationPageSize: 20,
   *   context: {
   *     showSearchBox: true, // Toggles search box
   *     searchBoxWidth: '300px', // Sets the search box width
   *   },
   * };
   * ```
   */

  defaultColDef = {
    filter: true,
    sortable: true,
    resizable: true,
    filterParams: {
      textMatcher: ({filterText, node}: {filterText: string; node: any}) => {
        if (!filterText || !node || !node.data) {
          return false; // No match if filter text or row data is missing
        }

        // Normalize the search term
        const normalizedFilterText = filterText.toString().toLowerCase();

        // Check all column values in the row for a match
        const match = Object.values(node.data).some((columnValue) => {
          if (typeof columnValue === 'string' || typeof columnValue === 'number') {
            return columnValue.toString().toLowerCase().includes(normalizedFilterText);
          }
          return false;
        });

        return match;
      }
    }
  };

  ngOnInit(): void {
    this.updateRowCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowData'] && changes['rowData'].currentValue) {
      // Call updateRowCount only if gridApi is initialized
      if (this.gridApi) {
        setTimeout(() => this.updateRowCount(), 0); // Ensure it runs after grid processes data
      }
    }
  }

  // if you do a search this method will change the displayed count
  private updateRowCount(): void {
    if (this.gridApi) {
      this.rowCount = this.gridApi.getDisplayedRowCount();
    } else {
      this.rowCount = this.rowData.length; // Fallback if gridApi isn't available
    }
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;

    // Merge defaultColDef into each columnDef
    const mergedColumnDefs = this.columnDefs.map((colDef) => ({
      ...this.defaultColDef, // Apply defaults
      ...colDef // Override with specific column settings
    }));

    // Update column definitions in gridOptions
    this.gridOptions.columnDefs = mergedColumnDefs;

    // Inform the grid to refresh its column definitions
    this.gridApi.refreshHeader();

    // Update the row count when the grid is ready
    this.updateRowCount();
  }

  // Trigger search only on Enter keypress
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onSearch(): void {
    if (this.gridApi) {
      // Apply the search term as a global text filter across all columns
      const filterModel = this.columnDefs.reduce((model, colDef) => {
        model[colDef.field] = {
          filter: this.searchTerm,
          filterType: 'text',
          type: 'contains'
        };
        return model;
      }, {});

      this.gridApi.setFilterModel(filterModel);

      // Update and log the filtered row count
      this.rowCount = this.gridApi.getDisplayedRowCount();
    }
  }

  onExportCsv(): void {
    this.gridApi.exportDataAsCsv({
      fileName: 'grid-data.csv',
      allColumns: true, // Include hidden columns
      onlySelected: false, // Export all rows, not just selected ones
      suppressQuotes: true // Avoid wrapping values in quotes
    });
  }

  onCopyToClipboard(): void {
    if (this.gridApi) {
      this.gridApi.copyToClipboard({
        includeHeaders: true // Include headers
      });
      // call popup here to alert the user
      this.snackBar.open('Data copied to clipboard!', 'Close', {
        duration: 3000, // Duration in milliseconds
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } else {
      console.error('Grid API is not initialized.');
    }
  }
}
