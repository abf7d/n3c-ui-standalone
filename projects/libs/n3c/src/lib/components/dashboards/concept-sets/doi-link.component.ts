import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ExternalLinkComponent} from '../../shared/external-link/external-link.component';
@Component({
  selector: 'app-doi-link',
  template: ` <app-external-link [url]="doi" [text]="doi"></app-external-link> `,
  styles: ['app-external-link {color: #007bff; cursor: pointer;}  ::ng-deep i {font-size: .7rem;}'],
  imports: [ExternalLinkComponent]
})
export class DoiLinkComponent implements ICellRendererAngularComp {
  public doi!: string;

  agInit(params: any): void {
    this.doi = params.value;
  }

  refresh(): boolean {
    return false;
  }
}
