import {CommonModule} from '@angular/common';
import {Component, Input, ViewEncapsulation} from '@angular/core';
import {LimitationsConfig} from './limitations.interface';

@Component({
  selector: 'app-limitations',
  imports: [CommonModule],
  templateUrl: './limitations.component.html',
  styleUrls: ['./limitations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LimitationsComponent {
  @Input() config!: LimitationsConfig;
  isExpanded = false;

  toggleCollapse() {
    this.isExpanded = !this.isExpanded;
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
}
