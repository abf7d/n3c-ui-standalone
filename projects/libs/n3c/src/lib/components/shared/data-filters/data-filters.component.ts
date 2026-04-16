import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {EventService} from '@odp/shared/lib/event-service/event.service';
import {EVENT_SERVICE} from '@odp/shared/lib/types';
import {FilterDataGroup, FilterViewGroup} from '../../../models/filter-models';

@Component({
  selector: 'app-data-filters',
  imports: [FormsModule],
  templateUrl: './data-filters.component.html',
  styleUrl: './data-filters.component.scss'
})
export class DataFiltersComponent implements OnInit, OnChanges {
  @Output() filterChange = new EventEmitter<any>();
  @Input() filterData!: FilterDataGroup[][];
  @Input() selectedFilters: {[key: string]: string[]} = {};

  public filterLayout!: FilterViewGroup[][];

  private mapDataToViewModel(data: FilterDataGroup[][]): FilterViewGroup[][] {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    return data.map((groupList) => {
      return groupList.map((group) => {
        return {
          title: group.title,
          type: group.type,
          collapsed: true,
          description: group.description,
          values: group.values.map((value) => {
            return {
              value: value,
              checked: false,
              hide: false
            };
          })
        };
      });
    });
  }

  public selectFilter(group: string, filter: {value: string; checked: boolean; hide: boolean}) {
    // Toggle the checked state of the filter
    filter.checked = !filter.checked;

    // Emit the updated filter state
    this.emitFilterState();
  }

  public searchFilter(values: any, event: any) {
    const searchTerm = event.target.value;
    if (!searchTerm) {
      values.forEach((v: any) => (v.hide = false));
      return;
    }
    values.forEach((v: any) => {
      v.hide = !v.value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  public toggleAll(group: string, values: any[], checked: boolean) {
    values.forEach((v) => (v.checked = checked));
    const selectedValues = checked ? values.map((v) => v.value) : [];

    this.emitFilterState();
  }

  private emitFilterState() {
    const selectedFilters: {[key: string]: string[]} = {};

    this.filterLayout
      .flatMap((groupList) => groupList)
      .forEach((group) => {
        selectedFilters[group.title] = group.values.filter((v) => v.checked).map((v) => v.value);
      });

    this.filterChange.emit(selectedFilters);
  }

  public clearAllFilters() {
    this.filterLayout.forEach((groupList) => {
      groupList.forEach((group) => {
        group.values.forEach((value) => {
          value.checked = false;
        });
      });
    });
    this.emitFilterState();
  }

  public get hasActiveFilters(): boolean {
    return this.filterLayout.some((groupList) =>
      groupList.some((group) => group.values.some((value) => value.checked))
    );
  }

  ngOnInit(): void {
    this.filterLayout = this.mapDataToViewModel(this.filterData);
    this.syncFilterUIWithSelected();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterData']) {
      this.filterLayout = this.mapDataToViewModel(this.filterData);
    }
    if (changes['selectedFilters'] && this.filterLayout) {
      this.syncFilterUIWithSelected();
    }
  }

  public syncFilterUIWithSelected(): void {
    if (!this.selectedFilters || !this.filterLayout) return;

    const normalized = Object.keys(this.selectedFilters).reduce(
      (acc, key) => {
        acc[this.normalizeKey(key)] = new Set(this.selectedFilters[key]);
        return acc;
      },
      {} as {[key: string]: Set<string>}
    );

    for (const groupList of this.filterLayout) {
      for (const group of groupList) {
        const selectedSet = normalized[this.normalizeKey(group.title)];
        for (const value of group.values) {
          value.checked = selectedSet?.has(value.value) ?? false;
        }
      }
    }
  }

  private normalizeKey(str: string): string {
    return str.replace(/\s+/g, '').toLowerCase();
  }
}
