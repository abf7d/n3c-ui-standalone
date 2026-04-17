import {Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {RelatedDashboardsComponent} from '../../shared/related-dashboards/related-dashboards.component';
import {Title} from '@angular/platform-browser';
import {PublicationeApiService} from '../../../services/api/publication-api/publication-api.service';
import {ViewChild, OnInit} from '@angular/core';
import {MasterDetailListComponent} from '../../shared/master-detail-list/master-detail-list.component';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {forkJoin} from 'rxjs';
import {DomainRow, RosterRow} from '@odp/n3c/lib/models/admin-models';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-teams-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    DashboardFooterComponent,
    MasterDetailListComponent,
    HeaderViewComponent,
    N3cLoaderComponent
  ],
  templateUrl: './teams-dashboard.component.html',
  styleUrl: './teams-dashboard.component.scss'
})
export class TeamsDashboardComponent implements OnInit {
  @ViewChild(RelatedDashboardsComponent) relatedDashboardsComponent!: RelatedDashboardsComponent;

  publications: any[] = [];
  domainTeams: DomainRow[] = [];
  projects: RosterRow[] = [];
  filterTypes: string[] = [];
  dataLoading: boolean = true;
  showError: boolean = false;

  private titleService = inject(Title);
  private publicationsApi = inject(PublicationeApiService);
  private siteMapApi = inject(SitemapApiService);

  constructor() {
    this.titleService.setTitle('N3C Teams');
  }

  ngOnInit(): void {
    this.fetchPublications();
  }

  fetchPublications(): void {
    const publications$ = this.publicationsApi.getPublications();
    const domainTeams$ = this.siteMapApi.getDomainTeams();
    const projects$ = this.siteMapApi.getProjectRoster();
    forkJoin([domainTeams$, projects$, publications$]).subscribe({
      next: ([domainTeams, projects, publications]) => {
        this.domainTeams = domainTeams.rows;
        this.publications = publications.rows;
        this.projects = projects.rows;
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
}
