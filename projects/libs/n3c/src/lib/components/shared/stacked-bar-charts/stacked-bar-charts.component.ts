import {Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChartGroup} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar.interface';
import {StackedBarService} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar.service';
import {StackedBarHelperService} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar-helper.service';

@Component({
  selector: 'app-stacked-bar-charts',
  templateUrl: './stacked-bar-charts.component.html',
  styleUrls: ['./stacked-bar-charts.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [StackedBarService, StackedBarHelperService]
})
export class StackedBarChartsComponent implements AfterViewInit, OnDestroy {
  @Input() chartData: ChartGroup[] = [];
  @Input() title = '';
  @Input() legendLabel = '';
  @Output() segmentFilterClick = new EventEmitter<{label: string; groupName: string}>();

  @ViewChild('chart', {static: true}) chartContainer!: ElementRef;
  @ViewChild('tooltipEl', {static: true}) tooltipRef!: ElementRef;

  showMenu = false;
  private resizeObserver!: ResizeObserver;

  constructor(
    private barService: StackedBarService,
    private helper: StackedBarHelperService
  ) {}

  get legendItems() {
    return this.helper.getLegendItems(this.chartData);
  }

  ngAfterViewInit() {
    this.barService.initTooltip(this.tooltipRef);
    this.resizeObserver = new ResizeObserver(() =>
      this.barService.renderChart(this.chartContainer, this.chartData, (label) => this.onLegendClick(label))
    );
    this.resizeObserver.observe(this.chartContainer.nativeElement);
    this.barService.renderChart(this.chartContainer, this.chartData, (label) => this.onLegendClick(label));
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  hideMenu() {
    this.showMenu = false;
  }

  saveAs(format: string) {
    const el = this.chartContainer.nativeElement;
    this.helper.exportAsImage(el, format, this.title).catch((err) => console.error('Export failed', err));
  }

  onLegendClick(label: string) {
    this.segmentFilterClick.emit({label, groupName: this.legendLabel});
  }

  onLegendHover(color: string) {
    this.barService.fadeSegmentsByColor(color);
  }

  onLegendLeave() {
    this.barService.resetSegmentOpacity();
  }
}
