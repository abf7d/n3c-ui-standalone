import {AfterViewInit, Component, Input, ViewEncapsulation} from '@angular/core';

import {N3cTooltipComponent} from '../../tooltip/tooltip.component';

@Component({
  selector: 'app-kpi-item',
  imports: [N3cTooltipComponent],
  templateUrl: './kpi-item.component.html',
  styleUrls: ['./kpi-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KpiItemComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() value!: string;
  @Input() icon!: string;
  @Input() tooltipTitle!: string;
  @Input() tooltipContent!: string;
  @Input() footer?: string;
  @Input() limitationsLink?: string;
  @Input() progress?: {value: number; tooltip: string} | null;

  currentProgressValue: number = 0;

  ngAfterViewInit(): void {
    if (this.progress) {
      requestAnimationFrame(() => {
        this.currentProgressValue = this.progress!.value;
      });
    }
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }
}
