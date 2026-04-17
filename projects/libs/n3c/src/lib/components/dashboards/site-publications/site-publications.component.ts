import {Component, inject, Input, OnInit} from '@angular/core';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {SimpleGridComponent} from '../../shared/simple-grid/simple-grid.component';
import {CollaboratingSitesApiService} from '../../../services/api/collaborating-sites-api/collaborating-sites-api.service';
import {ColDef, GridApi} from 'ag-grid-community';
import {PublicationRow, SitePublicationsResponse} from '../../../models/site-publications';

@Component({
  selector: 'app-site-publications',
  standalone: true,
  imports: [SimpleGridComponent, N3cLoaderComponent],
  templateUrl: './site-publications.component.html',
  styleUrls: ['./site-publications.component.scss']
})
export class SitePublicationsComponent implements OnInit {
  @Input() rorId!: string;
  @Input() siteName!: string;

  rowData: PublicationRow[] = [];
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {resizable: true, sortable: true, filter: true};
  loading = true;
  showError = false;

  private collabApi = inject(CollaboratingSitesApiService);

  ngOnInit() {
    this.initColDefs();
    if (this.rorId) {
      this.collabApi.getSitePublications(this.rorId).subscribe({
        next: (data: SitePublicationsResponse) => {
          this.rowData = (data.rows || []).map((row: PublicationRow) => ({
            ...row,
            authors: Array.isArray(row.authors) ? row.authors : []
          }));
          this.loading = false;
          this.showError = false;
        },
        error: (err) => {
          this.rowData = [];
          this.loading = false;
          this.showError = true;
        }
      });
    }
  }

  public initColDefs() {
    this.columnDefs = [
      {
        headerName: 'Title',
        field: 'title',
        width: 500,
        minWidth: 300,
        flex: 2,
        cellRenderer: (params: any) => {
          if (params.data && params.data.external_url) {
            return `<a href="${params.data.external_url}" target="_blank">${params.value}</a>`;
          }
          return params.value;
        }
      },
      {
        headerName: 'Local Authors',
        field: 'authors',
        width: 300,
        minWidth: 200,
        flex: 1,
        autoHeight: true,
        cellRenderer: (params: any) => {
          if (Array.isArray(params.value) && params.value.length > 0) {
            return `<ul>${params.value.map((author: string) => `<li>${author}</li>`).join('')}</ul>`;
          }
          return '';
        }
      }
    ];
  }
}
