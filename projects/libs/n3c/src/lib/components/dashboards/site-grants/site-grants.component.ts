import {Component, inject, Input, OnInit} from '@angular/core';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {CollaboratingSitesApiService} from '../../../services/api/collaborating-sites-api/collaborating-sites-api.service';
import {ColDef} from 'ag-grid-community';
import {GrantsData, GrantRow, GrantHeader, SubcontractRow, SubcontractHeader} from '../../../models/site-grants';

import {SimpleGridComponent} from '../../shared/simple-grid/simple-grid.component';

@Component({
  selector: 'app-site-grants',
  standalone: true,
  imports: [SimpleGridComponent, N3cLoaderComponent],
  templateUrl: './site-grants.component.html',
  styleUrls: ['./site-grants.component.scss']
})
export class SiteGrantsComponent implements OnInit {
  @Input() rorId!: string;

  grantsRowData: GrantRow[] = [];
  grantsColDefs: ColDef[] = [];
  subcontractsRowData: SubcontractRow[] = [];
  subcontractsColDefs: ColDef[] = [];
  defaultColDef: ColDef = {resizable: true, sortable: true, filter: true};
  loading = true;
  showError = false;

  private collabApi = inject(CollaboratingSitesApiService);

  ngOnInit() {
    if (this.rorId) {
      this.collabApi.getSiteGrants(this.rorId).subscribe({
        next: (data: GrantsData) => {
          this.initColDefs(data);
          this.grantsRowData = data.grants?.rows || [];
          this.subcontractsRowData = data.subcontracts?.rows || [];
          this.loading = false;
          this.showError = false;
        },
        error: () => {
          this.grantsRowData = [];
          this.subcontractsRowData = [];
          this.loading = false;
          this.showError = true;
        }
      });
    }
  }

  initColDefs(data: GrantsData) {
    this.grantsColDefs = (data.grants?.headers || []).map((h: GrantHeader) => ({
      headerName: h.label,
      field: h.value,
      flex: 1,
      minWidth: 120
    }));
    this.subcontractsColDefs = (data.subcontracts?.headers || []).map((h: SubcontractHeader) => ({
      headerName: h.label,
      field: h.value,
      flex: 1,
      minWidth: 120
    }));
  }
}
