import {CommonModule} from '@angular/common';
import {Component, ContentChild, Input, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-master-detail-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './master-detail-list.component.html',
  styleUrl: './master-detail-list.component.scss'
})
export class MasterDetailListComponent implements OnInit, OnChanges {
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPerPage: number = 5;
  filteredPublications: any[] = [];
  @Input() publications: any[] = [];
  @Input() title: string = '';
  private openItems = new Set<any>();

  @ContentChild('rowHeader', {static: true}) rowHeaderTpl!: TemplateRef<any>;
  @ContentChild('rowDetail', {static: true}) rowDetailTpl!: TemplateRef<any>;

  ngOnInit() {
    this.initPublications();
  }
  initPublications() {
    this.filteredPublications = this.publications;
    this.totalPages = Math.ceil(this.filteredPublications.length / this.itemsPerPage);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.initPublications();
  }
  isOpen(item: any) {
    return this.openItems.has(item);
  }
  toggle(item: any) {
    this.openItems.has(item) ? this.openItems.delete(item) : this.openItems.add(item);
  }
  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredPublications.length / this.itemsPerPage);
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
    }

    this.totalPages = Math.ceil(this.filteredPublications.length / this.itemsPerPage);
    this.currentPage = 1;
  }
  toggleDetails(publication: any): void {
    publication.showDetails = !publication.showDetails;
  }
  get paginatedPublications(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPublications.slice(start, start + this.itemsPerPage);
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
}
