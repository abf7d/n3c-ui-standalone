import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {Project} from '../projects.interface';

@Component({
  selector: 'app-projects-cell-renderer',
  imports: [CommonModule],
  templateUrl: './cell-renderer.component.html'
})
export class CellRendererComponent implements ICellRendererAngularComp {
  data = {} as Project;
  isExpanded = false;
  textLimit = 400;

  agInit(params: {data: Project}): void {
    this.data = params.data;
  }

  refresh(): boolean {
    return false;
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
