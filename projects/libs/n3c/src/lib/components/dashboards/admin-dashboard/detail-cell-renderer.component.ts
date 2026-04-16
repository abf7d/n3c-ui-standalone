import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

import type {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
    .site-desc,
    .site-desc p,
    .site-url,
    .site-created {
      line-height: 1.4rem;
    }
    .gridcell .fas {
      padding-right: 5px;
    }
    .gridcell {
      display: flex;
    }
  `,
  template: `<div role="gridcell" class="gridcell">
    <div (click)="isOpen = !isOpen">
      @if (!isOpen) {
        <i class="fas fa-plus"></i>
      }
      @if (isOpen) {
        <i class="fas fa-minus"></i>
      }
    </div>
    <div>
      <div>{{ data.title }}</div>
      @if (isOpen) {
        <div>
          <div class="site-desc" [innerHTML]="data.description"></div>
          <div class="site-created">Created: {{ data.created }}</div>
          <div class="site-url"><a href="{{ data.url }}" target="_blank">Learn More</a></div>
        </div>
      }
    </div>
  </div>`
})
export class DetailCellRendererComponent implements ICellRendererAngularComp {
  public data: any;
  public isOpen: boolean = false;
  agInit(params: any): void {
    this.data = params.data;
  }
  refresh(): boolean {
    return false;
  }
}
