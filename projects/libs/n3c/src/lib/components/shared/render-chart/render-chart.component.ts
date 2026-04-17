import {
  Component,
  Input,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  HostListener,
  inject
} from '@angular/core';
import {PieBarService} from '../../../services/charts/pie-bar/pie-bar.service';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {saveAs} from 'file-saver';
import {N3cLoaderComponent} from '../loader/loader.component';

@Component({
  selector: 'app-render-chart',
  templateUrl: './render-chart.component.html',
  styleUrls: ['./render-chart.component.scss'],
  imports: [N3cLoaderComponent],
  providers: [PieBarService]
})
export class RenderChartComponent implements AfterViewInit, OnChanges {
  @Input() data!: any[];
  @Input() colors!: string[];
  @Input() title!: string;
  @Input() displayMode: 'bar' | 'percent' | 'pie' = 'bar';
  @Input() groupName = '';
  private resizeTimeout: any;

  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Output() segmentFilterClick = new EventEmitter<{label: string; groupName: string}>();

  @ViewChild('chartContainer', {static: true}) chartContainer!: ElementRef;

  @HostListener('window:resize')
  onResize() {
    const debounceTime = 300;
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.drawChart();
    }, debounceTime);
  }

  private piebarService = inject(PieBarService);
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    if (!this.loading) {
      this.drawChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading'] && changes['loading'].currentValue === false) {
      setTimeout(() => {
        this.drawChart();
      });
    } else if (changes['data'] || changes['colors'] || changes['displayMode']) {
      if (!this.loading) {
        setTimeout(() => {
          this.drawChart();
        });
      }
    }
  }

  drawChart() {
    if (!this.chartContainer || !this.chartContainer.nativeElement) {
      console.warn('Chart container is not available yet.');
      return;
    }

    try {
      const containerWidth = this.chartContainer.nativeElement.getBoundingClientRect().width;
      const chartOptions = {
        groupName: this.groupName,
        valueLabelWidth: 80,
        barLabelPadding: 5,
        gridLabelHeight: 0,
        gridChartOffset: 3,
        maxBarWidth: containerWidth - 50,
        barLabelWidth: 125,
        min_height: 100,
        ordered: 1,
        legendLabel: 'Legend',
        barSpacing: 5
      };

      this.chartContainer.nativeElement.innerHTML = ''; // Clear the container

      if (this.displayMode === 'pie') {
        this.piebarService.drawDonutChart(
          this.chartContainer.nativeElement,
          this.data,
          this.colors,
          {
            groupName: this.groupName,
            width: 400,
            height: 170,
            radius: 100,
            donutWidth: 60
          },
          (payload) => {
            this.segmentFilterClick.emit(payload);
          }
        );
      } else if (this.displayMode === 'bar') {
        this.piebarService.drawBarChart(
          this.chartContainer.nativeElement,
          this.data,
          this.colors,
          {
            ...chartOptions,
            barHeight: 20
          },
          (payload) => {
            this.segmentFilterClick.emit(payload);
          }
        );
      } else if (this.displayMode === 'percent') {
        this.piebarService.drawPercentageBarChart(
          this.chartContainer.nativeElement,
          this.data,
          this.colors,
          {
            ...chartOptions,
            barHeight: 20
          },
          (payload) => {
            this.segmentFilterClick.emit(payload);
          }
        );
      }

      this.loading = false; // Stop showing spinner after the chart is rendered
      this.cdr.detectChanges(); // Force Angular to check for changes
    } catch (error) {
      console.error('Error while drawing chart:', error);
      this.loading = false;
      this.error = true; // Set an error flag if needed
      this.cdr.detectChanges(); // Force Angular to check for changes
    }
  }

  saveAs(format: string) {
    const element = this.chartContainer.nativeElement;
    if (!element) return;

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => saveAs(dataUrl, `${this.title}.jpg`));
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => saveAs(dataUrl, `${this.title}.png`));
        break;
      case 'svg':
        toSvg(element).then((dataUrl) => saveAs(dataUrl, `${this.title}.svg`));
        break;
    }
  }
}
