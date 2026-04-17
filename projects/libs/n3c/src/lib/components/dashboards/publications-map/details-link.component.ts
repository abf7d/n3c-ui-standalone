import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-details-link',
  template: `<a (click)="goToDetails()" class="link-primary">details</a>`,
  standalone: true
})
export class DetailsLinkComponent implements ICellRendererAngularComp {
  private id!: string;
  private router = inject(Router);

  agInit(params: any): void {
    this.id = params.data.id;
  }

  refresh(): boolean {
    return false;
  }

  goToDetails() {
    this.router.navigate([], {
      queryParams: {ror: this.id},
      queryParamsHandling: 'merge'
    });
  }
}
