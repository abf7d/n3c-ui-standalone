import {Component, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KpiItemComponent} from './kpi-item/kpi-item.component';
import {KpiColumnConfig, KpiPanelConfig} from './kpi-panel.interface';

@Component({
  selector: 'app-kpi-panel',
  imports: [CommonModule, KpiItemComponent],
  templateUrl: './kpi-panel.component.html',
  styleUrls: ['./kpi-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KpiPanelComponent {
  @Input() kpiConfigs: KpiPanelConfig = [];

  hasNestedRows(column: KpiColumnConfig): boolean | undefined {
    return column.rows && column.rows.length > 0;
  }
}
