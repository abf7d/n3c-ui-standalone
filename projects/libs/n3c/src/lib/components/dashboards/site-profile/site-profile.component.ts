import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {RouterModule} from '@angular/router';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {SitePublicationsComponent} from '../site-publications/site-publications.component';
import {SiteProjectsComponent} from '../site-projects/site-projects.component';
import {SiteGrantsComponent} from '../site-grants/site-grants.component';
import {SiteOverviewComponent} from '../site-overview/site-overview.component';
import {CollaboratingSitesApiService} from '../../../services/api/collaborating-sites-api/collaborating-sites-api.service';

@Component({
  selector: 'app-site-profile',
  standalone: true,
  imports: [
    RouterModule,
    DashboardFooterComponent,
    HeaderViewComponent,
    SitePublicationsComponent,
    SiteProjectsComponent,
    SiteGrantsComponent,
    N3cLoaderComponent,
    SiteOverviewComponent
  ],
  templateUrl: './site-profile.component.html',
  styleUrls: ['./site-profile.component.scss']
})
export class SiteProfileComponent implements OnInit {
  dataLoading = false;
  showError = false;
  siteId: string | null = null;
  siteName: string = '';
  selectedTab = 'overview';
  routeId: string | null = null;
  decodedId?: string = '';
  dropdownItems = [
    {key: 'overview', label: 'Overview'},
    {key: 'grants', label: 'Grants'},
    {key: 'projects', label: 'Projects'},
    {key: 'publications', label: 'Publications'}
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collabApi: CollaboratingSitesApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.routeId = params.get('siteId');
      const tab = params.get('tab');
      this.selectedTab = tab && this.dropdownItems.some((i) => i.key === tab) ? tab : 'overview';
      this.decodedId = this.routeId ? this.collabApi.decodeIdFromRoute(this.routeId) : '';
      if (this.decodedId) this.fetchSiteName(this.decodedId);
      else this.siteName = '';
    });
  }

  fetchSiteName(decodedId: string) {
    const wanted = this.collabApi.toComparableId(decodedId);
    this.collabApi.getSiteCollaborations().subscribe({
      next: (data: any) => {
        const sites = Array.isArray(data?.sites) ? data.sites : [];
        const found = sites.find((s: any) => this.collabApi.toComparableId(s?.id) === wanted);
        this.siteName = found?.site ?? '';
        this.showError = false;
      },
      error: () => {
        this.siteName = '';
        this.showError = true;
      }
    });
  }

  getSelectedTabLabel(): string {
    const found = this.dropdownItems.find((i) => i.key === this.selectedTab);
    return found ? found.label : '';
  }

  selectTab(key: string) {
    this.selectedTab = key;
  }

  onDropdownChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value;
    if (value) {
      this.selectTab(value);
    }
  }
}
