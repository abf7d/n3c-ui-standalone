import {Component, inject, OnInit, ViewChild, NO_ERRORS_SCHEMA, ChangeDetectorRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {RelatedDashboardsComponent} from '../../shared/related-dashboards/related-dashboards.component';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {PublicationeApiService} from '../../../services/api/publication-api/publication-api.service';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {signal} from '@angular/core';

const PUBLICATION_TYPE = 'publication';
const PREPRINT_TYPE = 'preprint';
const PRESENTATION_TYPE = 'presentation';
@Component({
  selector: 'app-about',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    DashboardFooterComponent,
    HeaderViewComponent,
    N3cLoaderComponent
  ]
})
export class N3cPublicationsComponent implements OnInit {
  @ViewChild(RelatedDashboardsComponent) relatedDashboardsComponent!: RelatedDashboardsComponent;

  relatedDashboardIds = ['Institutional_Collaboration_Map', 'Collaboration_Networks', 'N3C_Teams', 'N3C_Concept_Sets'];

  publications: any[] = [];
  filteredPublications: any[] = [];
  filterTypes: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  searchTerm: string = '';
  dataLoading: boolean = true;
  showError: boolean = false;
  pubCount = signal(0);
  preprintCount = signal(0);
  presentationCount = signal(0);

  private titleService = inject(Title);
  private cdr = inject(ChangeDetectorRef);
  private publicationsApi = inject(PublicationeApiService);

  constructor() {
    this.titleService.setTitle('N3C Publications');
  }

  ngOnInit(): void {
    this.fetchPublications();
  }

  fetchPublications(): void {
    this.publicationsApi.getPublications().subscribe({
      next: (data) => {
        this.publications = data.rows.map((pub) => ({...pub, showDetails: false}));
        this.filteredPublications = this.publications;
        this.totalPages = Math.ceil(this.filteredPublications.length / this.itemsPerPage);
        this.dataLoading = false;
        this.showError = false;
        this.setCounts();
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.dataLoading = false;
        this.showError = true;
      }
    });
  }
  setCounts(): void {
    let pubCount = 0;
    let preprintCount = 0;
    let presentationCount = 0;
    for (const pub of this.publications) {
      if (pub.type.toLocaleLowerCase() === PUBLICATION_TYPE) {
        pubCount += 1;
      } else if (pub.type.toLocaleLowerCase() === PREPRINT_TYPE) {
        preprintCount += 1;
      } else if (pub.type.toLocaleLowerCase() === PRESENTATION_TYPE) {
        presentationCount += 1;
      }
    }
    this.pubCount.set(pubCount);
    this.preprintCount.set(preprintCount);
    this.presentationCount.set(presentationCount);
  }

  get paginatedPublications(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPublications.slice(start, start + this.itemsPerPage);
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredPublications = this.publications;
    } else {
      const searchTermLower = this.searchTerm.trim().toLowerCase();

      this.filteredPublications = this.publications.filter(
        (pub) =>
          (pub.title && pub.title.toLowerCase().includes(searchTermLower)) ||
          (pub.authors && pub.authors.toLowerCase().includes(searchTermLower)) ||
          (pub.outlet && pub.outlet.toLowerCase().includes(searchTermLower))
      );

      this.cdr.detectChanges();
    }

    this.totalPages = Math.ceil(this.filteredPublications.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  onFilterChange(event: any): void {
    const type = event.target.value;
    if (event.target.checked) {
      this.filterTypes.push(type);
    } else {
      const index = this.filterTypes.indexOf(type);
      if (index > -1) {
        this.filterTypes.splice(index, 1);
      }
    }
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.filterTypes.length === 0) {
      this.filteredPublications = this.publications;
    } else {
      this.filteredPublications = this.publications.filter((pub) => this.filterTypes.includes(pub.type));
    }
    this.totalPages = Math.ceil(this.filteredPublications.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  toggleDetails(publication: any): void {
    publication.showDetails = !publication.showDetails;
  }

  getPaginationRange(): number[] {
    const start = Math.max(1, this.currentPage);
    const end = Math.min(start + 4, this.totalPages);
    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredPublications.length / this.itemsPerPage);
  }

  getEntriesInfo(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(start + this.itemsPerPage - 1, this.filteredPublications.length);
    const totalEntries = this.publications.length;
    const filteredTotal = this.filteredPublications.length;

    if (start > filteredTotal) {
      return `Showing 0 to 0 of ${totalEntries} entries`;
    }

    if (filteredTotal === totalEntries) {
      return `Showing ${start} to ${end} of ${totalEntries} entries`;
    } else {
      return `Showing ${start} to ${end} of ${filteredTotal} entries (filtered from ${totalEntries} total entries)`;
    }
  }
}
