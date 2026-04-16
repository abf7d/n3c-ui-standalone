import {Injectable, ElementRef} from '@angular/core';
import {select} from 'd3-selection';
import type {Selection} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import type {ScaleLinear} from 'd3-scale';
import {easeCubicOut} from 'd3-ease';
import {max} from 'd3-array';
import {timer} from 'd3-timer';
import 'd3-transition';
import {StackedBarHelperService} from './stacked-bar-helper.service';
import {ChartGroup, ChartSegment} from './stacked-bar.interface';

@Injectable()
export class StackedBarService {
  private svg!: Selection<SVGSVGElement, unknown, null, undefined>;
  private g!: Selection<SVGGElement, unknown, null, undefined>;
  private tooltip!: Selection<HTMLDivElement, unknown, null, undefined>;

  constructor(private helper: StackedBarHelperService) {}

  initTooltip(tooltipRef: ElementRef) {
    this.tooltip = select(tooltipRef.nativeElement);
  }

  renderChart(containerRef: ElementRef, chartData: ChartGroup[], onSegmentClick: (label: string) => void) {
    const container = containerRef.nativeElement;
    select(container).selectAll('*').remove();

    const width = container.clientWidth || 800;
    const barHeight = 20;
    const spacing = 4;
    const margin = {top: 10, right: 100, bottom: 10, left: 100};
    const height = chartData.length * (barHeight + spacing) + 10;

    this.svg = select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', width)
      .attr('height', height);

    this.g = this.svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const maxTotal = max(chartData, (group) => this.helper.getTotal(group))!;
    const x = scaleLinear()
      .domain([0, maxTotal])
      .range([0, width - margin.left - margin.right]);

    chartData.forEach((group, index) => this.drawGroup(group, index, x, barHeight, spacing, onSegmentClick));

    this.drawLabels(chartData, barHeight, spacing);
    this.g.selectAll('.domain').remove();
  }

  private drawGroup(
    group: ChartGroup,
    index: number,
    x: ScaleLinear<number, number>,
    barHeight: number,
    spacing: number,
    onSegmentClick: (label: string) => void
  ) {
    const groupY = index * (barHeight + spacing);
    let xOffset = 0;
    const total = this.helper.getTotal(group);

    group.segments.forEach((segment) => {
      if (segment.value <= 0) return;
      const segmentWidth = x(segment.value);

      const rect = this.g
        .append('rect')
        .attr('x', x(xOffset))
        .attr('y', groupY)
        .attr('width', 0)
        .attr('height', barHeight)
        .attr('rx', 4)
        .attr('fill', segment.color)
        .attr('class', 'bar-segment')
        .attr('data-color', segment.color)
        .style('cursor', 'pointer')
        .on('mouseenter', (event) => this.fadeSegments(segment.color, true, event, segment, group))
        .on('mousemove', (event) => this.moveTooltip(event))
        .on('mouseleave', () => this.fadeSegments(segment.color, false))
        .on('click', () => onSegmentClick(segment.label));

      timer((elapsed) => {
        const t = Math.min(1, elapsed / 500);
        rect.attr('width', segmentWidth * easeCubicOut(t));
        return t === 1;
      });

      if (segmentWidth > 40) {
        this.g
          .append('text')
          .attr('x', x(xOffset) + 6)
          .attr('y', groupY + barHeight / 2 + 4)
          .text(this.helper.formatValue(segment.value))
          .attr('fill', this.helper.getTextColorForBackground(segment.color))
          .style('font-size', '13px')
          .style('pointer-events', 'none');
      }

      xOffset += segment.value;
    });

    this.g
      .append('text')
      .attr('x', x(total) + 8)
      .attr('y', groupY + barHeight / 2 + 4)
      .text(this.helper.formatValue(total))
      .attr('fill', '#888')
      .style('font-size', '15px');
  }

  private drawLabels(chartData: ChartGroup[], barHeight: number, spacing: number) {
    chartData.forEach((group, index) => {
      const groupY = index * (barHeight + spacing);
      this.g
        .append('text')
        .attr('x', -10)
        .attr('y', groupY + barHeight / 2 + 5)
        .text(group.label)
        .attr('text-anchor', 'end')
        .style('font-size', '16px')
        .style('font-weight', '500')
        .style('fill', '#333');
    });
  }

  private fadeSegments(
    color: string,
    isHover: boolean,
    event?: MouseEvent,
    segment?: ChartSegment,
    group?: ChartGroup
  ) {
    this.g
      .selectAll<SVGRectElement, unknown>('rect.bar-segment')
      .interrupt()
      .transition()
      .duration(100)
      .style('opacity', function () {
        return isHover && select(this).attr('data-color') !== color ? '0.2' : '1';
      });

    if (isHover && event && segment && group) {
      const html = this.helper.getTooltipHtml(segment, group);
      this.tooltip.html(html).style('display', 'block').style('opacity', '1');
      this.moveTooltip(event);
    } else {
      this.tooltip.style('display', 'none').style('opacity', '0');
    }
  }

  private moveTooltip(event: MouseEvent) {
    this.tooltip.style('left', `${event.pageX + 15}px`).style('top', `${event.pageY + 15}px`);
  }

  fadeSegmentsByColor(color: string) {
    if (!this.g) return;
    this.g
      .selectAll<SVGRectElement, unknown>('rect.bar-segment')
      .interrupt()
      .transition()
      .duration(100)
      .style('opacity', function () {
        return select(this).attr('data-color') === color ? '1' : '0.2';
      });
  }

  resetSegmentOpacity() {
    if (!this.g) return;
    this.g
      .selectAll<SVGRectElement, unknown>('rect.bar-segment')
      .interrupt()
      .transition()
      .duration(300)
      .style('opacity', '1');
  }
}
