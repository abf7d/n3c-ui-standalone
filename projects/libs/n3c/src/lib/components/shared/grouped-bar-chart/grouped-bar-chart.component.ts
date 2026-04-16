import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GroupedBarService} from '@odp/n3c/lib/services/charts/grouped-bar/grouped-bar.service';
import {ChartGroup} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar.interface';
import {StackedBarHelperService} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar-helper.service';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [GroupedBarService, StackedBarHelperService]
})
export class GroupedBarChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: ChartGroup[] = [];
  @Input() title = '';
  @Input() legendLabel = '';
  @Output() segmentFilterClick = new EventEmitter<{label: string; groupName: string}>();

  @ViewChild('chart', {static: true}) chartContainer!: ElementRef;
  @ViewChild('chartWrapper', {static: true}) chartWrapper!: ElementRef;

  showMenu = false;
  private resizeObserver!: ResizeObserver;

  constructor(
    private groupedBarService: GroupedBarService,
    private chartService: StackedBarHelperService
  ) {}

  get legendItems() {
    return this.chartService.getLegendItems(this.data);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  hideMenu() {
    this.showMenu = false;
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => this.render());
    this.resizeObserver.observe(this.chartContainer.nativeElement);
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.groupedBarService.destroy(this.chartContainer.nativeElement);
  }

  private render(): void {
    this.groupedBarService.renderChart(this.chartContainer.nativeElement, this.data, (label) =>
      this.onLegendClick(label)
    );
  }

  onLegendClick(label: string) {
    this.segmentFilterClick.emit({label, groupName: this.legendLabel});
  }

  saveAs(format: string) {
    const el = this.chartWrapper.nativeElement;
    this.chartService.exportAsImage(el, format, this.title).catch((err) => console.error('Export failed', err));
  }
}
