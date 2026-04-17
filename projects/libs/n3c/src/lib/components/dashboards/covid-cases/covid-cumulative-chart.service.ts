import {Injectable} from '@angular/core';
import {select} from 'd3-selection';
import type {Selection} from 'd3-selection';
import {scaleTime, scaleLinear} from 'd3-scale';
import {line, curveMonotoneX} from 'd3-shape';
import {axisBottom, axisLeft, axisRight} from 'd3-axis';
import {extent, max, range, bisector} from 'd3-array';
import {timeFormat} from 'd3-time-format';
import {timeYear, timeMonth} from 'd3-time';
import {format} from 'd3-format';
import {brushX} from 'd3-brush';
import {pointer} from 'd3-selection';
import 'd3-transition';
import {CovidEntry} from './covid-cases.interface';

@Injectable()
export class CovidCumulativeChartService {
  private width!: number;
  private height!: number;
  private fontSize = 14;

  draw(data: CovidEntry[], container: HTMLElement) {
    if (!data?.length) {
      select(container).selectAll('*').remove();
      return;
    }

    const fullWidth = container.clientWidth;
    const aspectRatio = 16 / 7;
    const fullHeight = fullWidth / aspectRatio;

    const margin = {top: 30, right: 100, bottom: 100, left: 120};
    this.width = Math.max(0, fullWidth - margin.left - margin.right);
    this.height = Math.max(0, fullHeight - margin.top - margin.bottom);

    const dataset = data.map((d) => ({...d, date: new Date(d.first_diagnosis_date)})).sort((a, b) => +a.date - +b.date);

    const originalXDomain = extent(dataset, (d) => d.date) as [Date, Date];
    const x = scaleTime().domain(originalXDomain).range([0, this.width]);

    const yLeft = scaleLinear()
      .domain([0, max(dataset, (d) => d.cumulative_cases)! * 1.05])
      .range([this.height, 0]);

    const yRight = scaleLinear()
      .domain([0, max(dataset, (d) => d.seven_day_rolling_avg)! * 1.05])
      .range([this.height, 0]);

    select(container).selectAll('*').remove();
    const svgEl = select(container).append('svg').attr('width', fullWidth).attr('height', fullHeight);
    const svg = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // clip path
    svg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    // cumulative line
    const cumulativeLine = line<CovidEntry>()
      .x((d) => x((d as any).date))
      .y((d) => yLeft(d.cumulative_cases))
      .curve(curveMonotoneX);

    // avg line
    const avgLine = line<CovidEntry>()
      .x((d) => x((d as any).date))
      .y((d) => yRight(d.seven_day_rolling_avg))
      .curve(curveMonotoneX);

    const pathCumulative = svg
      .append('path')
      .datum(dataset)
      .attr('clip-path', 'url(#clip)')
      .attr('d', cumulativeLine as any)
      .attr('fill', 'none')
      .attr('stroke', '#607d8b')
      .attr('stroke-width', 2);

    const pathAvg = svg
      .append('path')
      .datum(dataset)
      .attr('clip-path', 'url(#clip)')
      .attr('d', avgLine as any)
      .attr('fill', 'none')
      .attr('stroke', '#7b1fa2')
      .attr('stroke-width', 2);

    // axes
    const xAxis = axisBottom(x)
      .tickFormat((date: any) => (timeYear(date) < date ? timeFormat('%b')(date) : timeFormat('%Y')(date)))
      .ticks(timeMonth.every(2));

    const xAxisG = svg.append('g').attr('transform', `translate(0,${this.height})`).call(xAxis);

    xAxisG
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')
      .style('font-size', `${this.fontSize}px`);

    svg
      .append('g')
      .call(
        axisLeft(yLeft)
          .ticks(Math.ceil(yLeft.domain()[1] / 1_000_000))
          .tickValues(range(0, Math.ceil(yLeft.domain()[1] / 1_000_000) * 1_000_000, 1_000_000))
      )
      .selectAll('text')
      .style('font-size', `${this.fontSize}px`);

    svg
      .append('g')
      .attr('transform', `translate(${this.width},0)`)
      .call(
        axisRight(yRight)
          .ticks(Math.ceil(yRight.domain()[1] / 5000))
          .tickValues(range(0, Math.ceil(yRight.domain()[1] / 5000) * 5000, 5000))
      )
      .selectAll('text')
      .style('font-size', `${this.fontSize}px`);

    // labels
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -120)
      .attr('x', -this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#607d8b')
      .style('font-size', `${this.fontSize + 2}px`)
      .style('font-weight', 'bold')
      .text('Cumulative COVID+ Patient Count');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', this.width + 80)
      .attr('x', -this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#7b1fa2')
      .style('font-size', `${this.fontSize + 2}px`)
      .style('font-weight', 'bold')
      .text('Rolling 7-Day Average Patient Count');

    svg
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + 70)
      .style('text-anchor', 'middle')
      .style('fill', '#333')
      .style('font-size', `${this.fontSize + 2}px`)
      .style('font-weight', 'bold')
      .text('Date');

    // legend
    const legend = svg.append('g').attr('transform', `translate(0, ${this.height + 70})`);
    const legendItems = [
      {label: 'Cumulative', color: '#607d8b', strokeWidth: 3},
      {label: '7-Day Ave', color: '#7b1fa2', strokeWidth: 3}
    ];
    legendItems.forEach((item, i) => {
      const g = legend.append('g').attr('transform', `translate(0, ${i * 20})`);
      g.append('line')
        .attr('x1', 0)
        .attr('x2', 15)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', item.color)
        .attr('stroke-width', item.strokeWidth);
      g.append('text')
        .attr('x', 20)
        .attr('y', 4)
        .style('fill', '#000')
        .style('font-size', `${this.fontSize + 2}px`)
        .text(item.label);
    });

    // tooltip & hover
    const focusLine = svg
      .append('line')
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none')
      .style('display', 'none');

    const tooltip = svg.append('g').style('display', 'none');
    tooltip
      .append('rect')
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('width', 140)
      .attr('height', 64)
      .attr('fill', 'black')
      .attr('opacity', 0.72)
      .attr('pointer-events', 'none');
    const tooltipDate = tooltip
      .append('text')
      .attr('x', 8)
      .attr('y', 18)
      .style('font-size', `${this.fontSize}px`)
      .style('fill', '#fff')
      .style('font-weight', 'bold');
    const tooltipCumulative = tooltip
      .append('text')
      .attr('x', 8)
      .attr('y', 36)
      .style('font-size', `${this.fontSize - 1}px`)
      .style('fill', '#fff');
    const tooltipAvg = tooltip
      .append('text')
      .attr('x', 8)
      .attr('y', 52)
      .style('font-size', `${this.fontSize - 1}px`)
      .style('fill', '#fff');

    const bisectDate = bisector((d: any) => d.date).left;
    const dateFmt = timeFormat('%m/%d/%y');
    const numFmt = format(',.3~f');

    // brush (zoom)
    const brush = brushX()
      .extent([
        [0, 0],
        [this.width, this.height]
      ])
      .on('start', () => {
        focusLine.style('display', 'none');
        tooltip.style('display', 'none');
      })
      .on('end', (event: any) => {
        if (!event.selection) return;
        const [x0, x1] = event.selection;
        x.domain([x.invert(x0), x.invert(x1)]);
        gBrush.call(brush.move, null);
        redraw();
      });

    const gBrush = svg.append('g').attr('class', 'brush').call(brush);

    // hover logic
    svgEl
      .on('mousemove', (event: any) => {
        const [mx] = pointer(event, svgEl.node() as any);
        const chartX = mx - margin.left;
        if (chartX < 0 || chartX > this.width) {
          focusLine.style('display', 'none');
          tooltip.style('display', 'none');
          return;
        }

        focusLine.style('display', null);
        tooltip.style('display', null);

        const xDate = x.invert(chartX);
        const i = bisectDate(dataset, xDate, 1);
        const d0 = dataset[i - 1];
        const d1 = dataset[i];
        const d = !d1 ? d0 : xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;

        const fx = x(d.date);
        focusLine.attr('x1', fx).attr('x2', fx);

        let tx = fx + 12;
        if (tx + 200 > this.width) tx = fx - 212;
        tooltip.attr('transform', `translate(${tx},12)`);

        tooltipDate.text(dateFmt(d.date));
        tooltipCumulative.text(`Cumulative: ${numFmt(d.cumulative_cases)}`);
        tooltipAvg.text(`7-Day Ave: ${numFmt(d.seven_day_rolling_avg)}`);
      })
      .on('mouseleave', () => {
        focusLine.style('display', 'none');
        tooltip.style('display', 'none');
      });

    // double-click reset
    svgEl.on('dblclick', () => {
      x.domain(originalXDomain);
      redraw();
    });

    // redraw function
    const redraw = () => {
      const newXAxis = axisBottom(x)
        .tickFormat((date: any) => (timeYear(date) < date ? timeFormat('%b')(date) : timeFormat('%Y')(date)))
        .ticks(timeMonth.every(2));

      xAxisG.transition().duration(500).call(newXAxis);
      xAxisG
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)')
        .style('font-size', `${this.fontSize}px`);

      pathCumulative
        .datum(dataset)
        .transition()
        .duration(500)
        .attr('d', cumulativeLine as any);
      pathAvg
        .datum(dataset)
        .transition()
        .duration(500)
        .attr('d', avgLine as any);

      focusLine.style('display', 'none');
      tooltip.style('display', 'none');
    };
  }
}
