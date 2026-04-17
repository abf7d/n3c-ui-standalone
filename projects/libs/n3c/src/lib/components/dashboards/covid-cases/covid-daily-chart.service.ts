import {Injectable} from '@angular/core';
import {select} from 'd3-selection';
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
export class CovidDailyChartService {
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

    const margin = {top: 30, right: 100, bottom: 100, left: 100};
    this.width = Math.max(0, fullWidth - margin.left - margin.right);
    this.height = Math.max(0, fullHeight - margin.top - margin.bottom);

    const dataset = data.map((d) => ({...d, date: new Date(d.first_diagnosis_date)})).sort((a, b) => +a.date - +b.date);

    const originalXDomain = extent(dataset, (d) => d.date) as [Date, Date];
    const x = scaleTime().domain(originalXDomain).range([0, this.width]);

    const maxValue = max([
      max(dataset, (d) => d.positive_cases_int) || 0,
      max(dataset, (d) => d.seven_day_rolling_avg) || 0
    ])!;

    const yLeft = scaleLinear()
      .domain([0, maxValue * 1.08])
      .range([this.height, 0]);
    const yRight = scaleLinear()
      .domain([0, maxValue * 1.08])
      .range([this.height, 0]);

    // clear & build
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

    // lines
    const casesLine = line<CovidEntry>()
      .x((d) => x((d as any).date))
      .y((d) => yLeft(d.positive_cases_int))
      .curve(curveMonotoneX);

    const avgLine = line<CovidEntry>()
      .x((d) => x((d as any).date))
      .y((d) => yRight(d.seven_day_rolling_avg))
      .curve(curveMonotoneX);

    const pathCases = svg
      .append('path')
      .datum(dataset)
      .attr('clip-path', 'url(#clip)')
      .attr('d', casesLine as any)
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round');

    const pathAvg = svg
      .append('path')
      .datum(dataset)
      .attr('clip-path', 'url(#clip)')
      .attr('d', avgLine as any)
      .attr('fill', 'none')
      .attr('stroke', '#7b1fa2')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round');

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

    const step = 5000;
    const yMax = Math.ceil(maxValue / step) * step;
    yLeft.domain([0, yMax]);
    yRight.domain([0, yMax]);

    const tickValues = range(0, yMax + step, step);

    const yLeftG = svg.append('g').call(axisLeft(yLeft).tickValues(tickValues));
    yLeftG.selectAll('text').style('font-size', `${this.fontSize}px`);

    const yRightG = svg
      .append('g')
      .attr('transform', `translate(${this.width},0)`)
      .call(axisRight(yRight).tickValues(tickValues));
    yRightG.selectAll('text').style('font-size', `${this.fontSize}px`);

    // axis labels
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -90)
      .attr('x', -this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#999')
      .style('font-size', `${this.fontSize + 2}px`)
      .style('font-weight', 'bold')
      .text('COVID+ Patient Count');

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
      {label: 'COVID+', color: '#999', strokeWidth: 3},
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

    // hover vertical line & tooltip
    const focusLine = svg
      .append('line')
      .attr('y1', 0)
      .attr('y2', this.height)
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none')
      .style('display', 'none');

    const tooltip = svg.append('g').style('display', 'none');
    const tooltipRect = tooltip
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
    const tooltipCases = tooltip
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
    const dateFmt = timeFormat('%b %d, %Y');
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

    focusLine.raise();
    tooltip.raise();

    // hover detection
    const showHover = () => {
      focusLine.style('display', null);
      tooltip.style('display', null);
    };
    const hideHover = () => {
      focusLine.style('display', 'none');
      tooltip.style('display', 'none');
    };

    svgEl
      .on('mousemove', (event: any) => {
        const [mx, my] = pointer(event, svgEl.node() as any);
        const chartX = mx - margin.left;
        const chartY = my - margin.top;

        if (chartX < 0 || chartX > this.width || chartY < 0 || chartY > this.height) {
          hideHover();
          return;
        }

        showHover();

        const xDate = x.invert(chartX);
        const i = bisectDate(dataset, xDate, 1);
        const d0 = dataset[i - 1];
        const d1 = dataset[i];
        const d = !d1 ? d0 : xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;

        const fx = x(d.date);
        focusLine.attr('x1', fx).attr('x2', fx);

        const tooltipW = +tooltipRect.attr('width');
        let tx = fx + 12;
        if (tx + tooltipW > this.width) tx = fx - tooltipW - 12;
        if (tx < 0) tx = 0;
        const ty = 12;
        tooltip.attr('transform', `translate(${tx}, ${ty})`);

        tooltipDate.text(dateFmt(d.date));
        tooltipCases.text(`COVID+: ${numFmt(d.positive_cases_int)}`);
        tooltipAvg.text(`7-Day Ave: ${numFmt(d.seven_day_rolling_avg)}`);
      })
      .on('mouseleave', () => {
        hideHover();
      });

    // reset on double click
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

      pathCases
        .datum(dataset)
        .transition()
        .duration(500)
        .attr('d', casesLine as any);
      pathAvg
        .datum(dataset)
        .transition()
        .duration(500)
        .attr('d', avgLine as any);

      hideHover();
    };
  }
}
