import {Component, ElementRef, inject, Input, OnChanges, Renderer2, ViewChild} from '@angular/core';
import {select, selectAll} from 'd3-selection';
import {scaleBand, scaleLinear} from 'd3-scale';
import {max, range} from 'd3-array';
import 'd3-transition';

@Component({
  selector: 'app-horizontal-bar-chart',
  template: `<div #chartContainer></div>`,
  styles: [
    `
      div.bar.tooltip {
        position: absolute;
        background-color: white;
        opacity: 0.8;
        height: auto;
        padding: 1px;
        pointer-events: none;
      }
    `
  ],
  standalone: false
})
export class HorizontalBarChartComponent implements OnChanges {
  @ViewChild('chartContainer', {static: true}) chartContainer!: ElementRef;
  @Input() data: any[] = [];
  @Input() properties: any;

  private renderer = inject(Renderer2);

  ngOnChanges(): void {
    this.createChart();
  }

  createChart(): void {
    if (!this.data || !this.properties) return;

    const valueLabelWidth = 80;
    const barHeight = 20;
    const barLabelPadding = 5;
    const gridLabelHeight = 0;
    const gridChartOffset = 3;
    let maxBarWidth = 280;

    const barValue = (d: any) => parseFloat(d.count);

    if (this.properties.ordered && this.properties.ordered == 1) {
      this.data.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
    }

    // Remove existing SVG if present
    select(this.chartContainer.nativeElement).select('svg').remove();

    // Set up resizing observer
    const resizeObserver = new ResizeObserver(() => {
      const newWidth = this.chartContainer.nativeElement.offsetWidth;
      if (newWidth > 0) {
        select(this.chartContainer.nativeElement).select('svg').remove();
        maxBarWidth = newWidth - this.properties.barLabelWidth - barLabelPadding - valueLabelWidth;
        this.drawBarChart(maxBarWidth, valueLabelWidth, barHeight, barLabelPadding, gridLabelHeight, gridChartOffset);
      }
    });

    resizeObserver.observe(this.chartContainer.nativeElement);

    // Initial draw
    maxBarWidth =
      this.chartContainer.nativeElement.offsetWidth - this.properties.barLabelWidth - barLabelPadding - valueLabelWidth;
    this.drawBarChart(maxBarWidth, valueLabelWidth, barHeight, barLabelPadding, gridLabelHeight, gridChartOffset);
  }

  drawBarChart(
    maxBarWidth: number,
    valueLabelWidth: number,
    barHeight: number,
    barLabelPadding: number,
    gridLabelHeight: number,
    gridChartOffset: number
  ): void {
    const yScale = scaleBand()
      .domain(range(0, this.data.length).map(String))
      .range([0, this.data.length * barHeight])
      .padding(0.1);
    const xScale = scaleLinear()
      .domain([0, max(this.data, (d) => parseFloat(d.count))!])
      .range([0, maxBarWidth]);

    const chart = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.chartContainer.nativeElement.offsetWidth)
      .attr('height', gridLabelHeight + gridChartOffset + this.data.length * barHeight);

    // Bar labels
    const barLabel = (d: any) => d.abbrev;
    const labelsContainer = chart
      .append('g')
      .attr(
        'transform',
        `translate(${this.properties.barLabelWidth - barLabelPadding}, ${gridLabelHeight + gridChartOffset})`
      );

    labelsContainer
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('y', (_, i) => yScale(i.toString())! + yScale.bandwidth() / 2)
      .attr('stroke', 'none')
      .attr('fill', '#3c3c3d')
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(barLabel)
      .on('mousemove', (event, d) => {
        selectAll('.tooltip').remove();
        select('body')
          .append('div')
          .attr('class', 'bar tooltip')
          .style('opacity', 0.8)
          .style('left', event.pageX + 5 + 'px')
          .style('top', event.pageY - 28 + 'px')
          .html(d.element);
      })
      .on('mouseout', () => selectAll('.tooltip').remove());

    // Bars
    const barsContainer = chart
      .append('g')
      .attr('transform', `translate(${this.properties.barLabelWidth}, ${gridLabelHeight + gridChartOffset})`);

    barsContainer
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('y', (_, i) => yScale(i.toString())!)
      .attr('rx', 2)
      .attr('height', yScale.bandwidth())
      .attr('width', 0) // Start width at 0 for animation
      .attr('stroke', 'white')
      .attr('fill', (d) => this.properties.colorscale[d.seq - 1])
      .on('click', (d) => {
        selectAll('.tooltip').remove();
        const format = {secondary_name: d.element};
        (window as any)[this.properties.domName.replace(/_[^_]+_[^_]+$/i, '_').replace('#', '') + 'viz_constrain'](
          format,
          this.properties.legend_label.replace(/\s/g, '')
        );
      })
      .on('mousemove', (event, d) => {
        selectAll('.tooltip').remove();
        select('body')
          .append('div')
          .attr('class', 'bar tooltip')
          .style('opacity', 0.8)
          .style('left', event.pageX + 5 + 'px')
          .style('top', event.pageY - 28 + 'px')
          .html(`<strong>${d.element}</strong><br><strong>Count:</strong> ${d.count.toLocaleString()}`);
      })
      .on('mouseout', () => selectAll('.tooltip').remove())
      .transition()
      .duration(1000)
      .attr('width', (d) => xScale(parseFloat(d.count)));

    // Bar value labels
    barsContainer
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('x', (d) => xScale(parseFloat(d.count)))
      .attr('y', (_, i) => yScale(i.toString())! + yScale.bandwidth() / 2)
      .attr('dx', 3)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#3c3c3d')
      .attr('stroke', 'none')
      .text((d) => this.nFormatter(parseFloat(d.count), 2));
  }

  nFormatter(num: number, digits: number): string {
    const lookup = [
      {value: 1, symbol: ''},
      {value: 1e3, symbol: 'k'},
      {value: 1e6, symbol: 'M'},
      {value: 1e9, symbol: 'G'},
      {value: 1e12, symbol: 'T'},
      {value: 1e15, symbol: 'P'},
      {value: 1e18, symbol: 'E'}
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find((item) => num >= item.value);
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
  }
}
