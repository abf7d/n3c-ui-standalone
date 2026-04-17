import {Injectable} from '@angular/core';
import {select} from 'd3-selection';
import type {Selection} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import 'd3-transition';
import {ChartGroup} from '../stacked-bar/stacked-bar.interface';

@Injectable()
export class GroupedBarService {
  private svg!: Selection<SVGSVGElement, unknown, null, undefined>;

  renderChart(containerEl: HTMLElement, data: ChartGroup[], onLegendClick: (label: string) => void): void {
    if (!containerEl) return;

    // clear previous
    select(containerEl).selectAll('*').remove();
    if (!data || !data.length) return;

    // layout params
    const barHeight = 18;
    const subBarSpacing = 3;
    const rightValueLabelSpace = 80;
    const barCornerRadius = 3;
    const groupInnerPadding = 6;

    const labelColumnWidth = 200;
    const leftPadding = 8;

    const width = containerEl.getBoundingClientRect().width || 800;

    // calculate group heights
    const groupHeights: number[] = data.map((g) => {
      const validSegments = g.segments?.filter((s) => (s.value ?? 0) > 0) ?? [];
      const n = validSegments.length;
      return n * barHeight + Math.max(0, n - 1) * subBarSpacing + groupInnerPadding * 2;
    });

    const groupStart: number[] = [];
    let yCursor = 0;
    for (let i = 0; i < groupHeights.length; i++) {
      groupStart.push(yCursor);
      yCursor += groupHeights[i];
    }
    const svgHeight = yCursor;

    const svg = select(containerEl)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${svgHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', width)
      .attr('height', svgHeight);

    this.svg = svg;

    // alternating background
    svg
      .append('g')
      .selectAll('rect.group-bg')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', (_d, i) => groupStart[i])
      .attr('width', width)
      .attr('height', (_d, i) => groupHeights[i])
      .attr('fill', (_d, i) => (i % 2 === 0 ? '#f6f6f6' : 'transparent'));

    // group labels
    const labelX = leftPadding;
    const labelContainer = svg.append('g');
    labelContainer
      .selectAll('text.group-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'group-label')
      .attr('x', labelX)
      .attr('y', (_d, i) => groupStart[i] + groupHeights[i] / 2)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#3c3c3d')
      .style('font-weight', '600')
      .style('font-size', '16px')
      .text((d) => d.label)
      .on('mousemove', (event, d) => {
        const total = d.segments.reduce((sum, s) => sum + (s.value ?? 0), 0);
        select(containerEl).selectAll('.d3-tooltip').remove();
        select(containerEl)
          .append('div')
          .attr('class', 'd3-tooltip')
          .style('opacity', 0.9)
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('color', 'rgba(0,0,0,0.75)')
          .style('outline', '1px solid rgba(0,0,0,0.12)')
          .style('padding', '6px')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 24}px`)
          .html(`<strong>${d.label} </strong>(${this.formatNumber(total)})`);
      })
      .on('mouseout', () => select(containerEl).selectAll('.d3-tooltip').remove());

    const barsContainer = svg.append('g').attr('transform', `translate(${labelColumnWidth + leftPadding},0)`);

    const maxValue = max(data, (d) => max(d.segments, (s) => s.value) ?? 0) ?? 0;
    const barsWidth = Math.max(100, width - (labelColumnWidth + leftPadding) - rightValueLabelSpace);
    const xScale = scaleLinear()
      .domain([0, maxValue || 1])
      .range([0, barsWidth]);

    // draw bars
    data.forEach((group, gi) => {
      const startY = groupStart[gi];
      const validSegments = group.segments.filter((seg) => (seg.value ?? 0) > 0);

      validSegments.forEach((seg, si) => {
        const segY = startY + groupInnerPadding + si * (barHeight + subBarSpacing);
        const segValue = seg.value;
        const segWidth = xScale(segValue);

        barsContainer
          .append('rect')
          .attr('x', 0)
          .attr('y', segY)
          .attr('height', barHeight)
          .attr('width', 0)
          .attr('fill', seg.color ?? '#888')
          .attr('rx', barCornerRadius)
          .attr('ry', barCornerRadius)
          .on('mousemove', (event) => {
            select(containerEl).selectAll('.d3-tooltip').remove();
            select(containerEl)
              .append('div')
              .attr('class', 'd3-tooltip')
              .style('opacity', 0.9)
              .style('position', 'absolute')
              .style('background-color', 'white')
              .style('color', 'rgba(0,0,0,0.75)')
              .style('outline', '1px solid rgba(0,0,0,0.12)')
              .style('padding', '6px')
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 24}px`)
              .html(
                `<strong style="color:${seg.color ?? '#888'}">${seg.label}</strong><br/>
                 <strong>Count: </strong>${this.formatNumber(segValue)}<br/>
                 <strong>% of ${seg.label} that are ${group.label}: </strong>${seg.percentage ?? ''}%`
              );
          })
          .on('mouseout', () => select(containerEl).selectAll('.d3-tooltip').remove())
          .on('click', () => {
            onLegendClick(seg.label);
          })
          .transition()
          .duration(900)
          .attr('width', Math.max(1, segWidth));

        barsContainer
          .append('text')
          .attr('x', segWidth + 8)
          .attr('y', segY + barHeight / 2)
          .attr('dy', '.35em')
          .attr('text-anchor', 'start')
          .attr('fill', '#3c3c3d')
          .style('font-size', '15px')
          .text(this.formatNumber(segValue))
          .style('opacity', 0)
          .transition()
          .delay(300)
          .duration(500)
          .style('opacity', 1);
      });
    });
  }

  destroy(containerEl: HTMLElement): void {
    select(containerEl).selectAll('*').remove();
    select(containerEl).selectAll('.d3-tooltip').remove();
  }

  private formatNumber(n: number) {
    return n.toLocaleString('en-US');
  }
}
