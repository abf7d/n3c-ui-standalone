import {Component, Input, OnInit} from '@angular/core';

import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {CollaboratingSitesApiService} from '../../../services/api/collaborating-sites-api/collaborating-sites-api.service';
import {ProjectRow, SiteProjectsResponse} from '../../../models/site-projects';
import {SimpleGridComponent} from '../../shared/simple-grid/simple-grid.component';

@Component({
  selector: 'app-site-projects',
  standalone: true,
  imports: [N3cLoaderComponent, SimpleGridComponent],
  templateUrl: './site-projects.component.html',
  styleUrls: ['./site-projects.component.scss']
})
export class SiteProjectsComponent implements OnInit {
  @Input() rorId!: string;
  rowData: ProjectRow[] = [];
  columnDefs: any[] = [];
  defaultColDef = {resizable: true, sortable: true, filter: true};
  loading = true;
  showError = false;

  constructor(private collabApi: CollaboratingSitesApiService) {}

  ngOnInit() {
    this.initColDefs();
    if (this.rorId) {
      this.collabApi.getSiteProjects(this.rorId).subscribe({
        next: (data: SiteProjectsResponse) => {
          this.rowData = (data.rows || []).map((row) => ({
            ...row,
            collaborators: Array.isArray(row.collaborators) ? row.collaborators : [],
            members: Array.isArray(row.members) ? row.members : []
          }));
          this.loading = false;
          this.showError = false;
        },
        error: () => {
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
        headerName: 'Status',
        field: 'workspace_status',
        flex: 1
      },
      {
        headerName: 'Title',
        field: 'title',
        flex: 2
      },
      {
        headerName: 'Lead Investigator',
        field: 'lead_investigator',
        flex: 1
      },
      {
        headerName: 'Members From This Site',
        field: 'members',
        flex: 1,
        autoHeight: true,
        cellRenderer: (params: any) => {
          if (Array.isArray(params.value) && params.value.length > 0) {
            return `<ul>${params.value.map((member: string) => `<li>${member}</li>`).join('')}</ul>`;
          }
          return '';
        }
      },
      {
        headerName: 'Collaborating Organizations (# investigators)',
        field: 'collaborators',
        flex: 2,
        valueFormatter: (params: {value: string[]}) => (Array.isArray(params.value) ? params.value.join(', ') : '')
      }
    ];
  }
}
