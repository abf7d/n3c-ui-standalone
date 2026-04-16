import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ExternalLinkComponent} from '../../shared/external-link/external-link.component';
@Component({
  selector: 'app-site-cell-renderer',
  template: ` <app-external-link [url]="params.url" [text]="params.site"></app-external-link> `,
  styles: ['app-external-link {color: #007bff; cursor: pointer;}  ::ng-deep i {font-size: .7rem;}'],
  imports: [ExternalLinkComponent]
})
export class SiteCellRendererComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params.data;
  }

  refresh(): boolean {
    return false;
  }
}
