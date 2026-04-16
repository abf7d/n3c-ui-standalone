import {Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';

import {PopoverDirective} from '@odp/shared/lib/popover/popover.directive';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [PopoverDirective],
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class N3cTooltipComponent {
  @Input() label!: string;
  @Input() tooltipTitle!: string;
  @Input() tooltipContent!: string;
  @Input() variant: 'kpi' | 'inline' = 'inline';

  @ViewChild('popover') popover!: PopoverDirective;

  closePopover() {
    if (this.popover) {
      this.popover.close();
    }
  }
}
