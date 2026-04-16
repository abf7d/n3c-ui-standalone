// download-links-renderer.component.ts
import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {DataDownloadApiService} from '../../../services/api/data-download-api/data-download-api.service';

@Component({
  selector: 'app-download-links-renderer',
  template: `
    <div class="download-links">
      <a (click)="downloadFile('csv', $event)" class="download-link csv-link" title="Download as CSV">
        <i class="fas fa-file-download"></i> CSV
      </a>
      <a (click)="downloadFile('json', $event)" class="download-link json-link" title="Download as JSON">
        <i class="fas fa-file-code"></i> JSON
      </a>
    </div>
  `,
  styles: [
    `
      .download-links {
        display: flex;
        gap: 20px;
        a {
          text-decoration: none;
        }
      }
      .download-link {
        cursor: pointer;
        color: #007bff;
      }
      .download-link:hover {
        color: #0056b3;
      }
    `
  ],
  standalone: false
})
export class DownloadCellRenderComponent implements ICellRendererAngularComp {
  private params: any;
  private file!: string;
  private tableSchema!: string;

  constructor(private downloadService: DataDownloadApiService) {}

  // AG Grid lifecycle method
  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.file = params.data.file;
    this.tableSchema = params.data.table_schema;
  }

  // Required by AG Grid for component refresh
  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    this.file = params.data.file;
    this.tableSchema = params.data.table_schema;
    return true;
  }

  downloadFile(downloadType: 'csv' | 'json', event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.file || !this.tableSchema) {
      console.error('Missing required file or table_schema values');
      return;
    }

    // Subscribe to the download service observable
    this.downloadService.getFile(this.tableSchema, this.file, downloadType).subscribe({
      next: (data: any) => {
        console.log('Received data:', data);

        let fileContent: string;
        let mimeType: string;

        // Convert the data to the appropriate format
        if (downloadType === 'json') {
          fileContent = JSON.stringify(data, null, 2); // Pretty-print JSON
          mimeType = 'application/json';
        } else if (downloadType === 'csv') {
          fileContent = typeof data === 'string' ? data : '';
          mimeType = 'text/csv';
        } else {
          console.error('Unsupported download type:', downloadType);
          return;
        }

        // Create a Blob from the file content
        const blob = new Blob([fileContent], {type: mimeType});

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const filename = `${this.file}_${this.tableSchema}.${downloadType}`;

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Append to the document, click, and clean up
        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error(`Error downloading ${downloadType} file:`, error);
        // You might want to add some user-visible error handling here
      }
    });
  }
}
