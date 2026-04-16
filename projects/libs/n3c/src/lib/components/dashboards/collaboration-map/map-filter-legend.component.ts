import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SiteCollaborationLegend} from './collaboration-map.interface';

import {legendColors} from './constants';

@Component({
  selector: 'app-map-filter',
  template: `
    <div class="map-filter">
      @for (legend of legends; track legend) {
        <label class="filter-option">
          <input
            type="checkbox"
            [value]="legend.org_type"
            (change)="onToggleFilter($event)"
            [checked]="activeFilters.includes(legend.org_type)"
          />
          <i
            class="rounded-circle d-inline-block mx-1 filter-icon"
            [style.background-color]="getColor(legend.org_type)"
          ></i
          >{{ legend.org_type }} [{{ legend.count }}]
        </label>
      }
    </div>
  `,
  styles: [
    `
      .filter-icon {
        width: 12px;
        height: 12px;
      }
      .map-filter {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .filter-option {
        font-size: 18px;
        user-select: none;
      }
    `
  ],
  imports: []
})
export class MapFilterLegendComponent {
  @Output() filterChange = new EventEmitter<string[]>();
  @Input() legends: SiteCollaborationLegend[] = [];

  activeFilters: string[] = [];

  onToggleFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const orgType = input.value;

    if (input.checked) {
      this.activeFilters.push(orgType);
    } else {
      this.activeFilters = this.activeFilters.filter((f) => f !== orgType);
    }

    this.filterChange.emit(this.activeFilters);
  }

  getColor(orgType: string): string {
    return legendColors[orgType] || '#000';
  }
}
