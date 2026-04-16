import {Injectable} from '@angular/core';
import {select, pointer} from 'd3-selection';
import type {Selection} from 'd3-selection';
import {scaleTime, scaleLinear} from 'd3-scale';
import type {ScaleTime, ScaleLinear} from 'd3-scale';
import {line, area} from 'd3-shape';
import type {Line} from 'd3-shape';
import {axisBottom, axisLeft} from 'd3-axis';
import {extent, max, bisector} from 'd3-array';
import {timeParse, timeFormat} from 'd3-time-format';
import {timeYear} from 'd3-time';
import type {ZoomBehavior} from 'd3-zoom';
import {DuaEntry} from '../../../models/admin-models';
@Injectable()
export class DuaLineChartService {
  projection: any;

  private width!: number;
  private height!: number;
  path!: Line<DuaEntry>;
  zoom!: ZoomBehavior<Element, unknown>;
  svg!: Selection<SVGGElement, unknown, null, undefined>;

  constructor() {}
  draw(duaData: DuaEntry[], el: any) {
    this.width = 470;
    this.height = 160;
    var margin = {top: 30, right: 100, bottom: 40, left: 50};
    this.width = this.width - margin.left - margin.right;
    this.height = this.height - margin.top - margin.bottom;

    // Scales
    const x = scaleTime().range([0, this.width]);
    const y = scaleLinear().range([this.height, 0]);

    // SVG setup
    const dua_dta_svg = select(el)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 475 200')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse date
    const parseDate = timeParse('%m/%d/%Y');
    duaData.forEach((d: any) => {
      d.date = new Date(d.date);
    });

    // Domain
    //@ts-ignore
    x.domain(extent(duaData, (d) => d.date));
    //@ts-ignore
    y.domain([0, max(duaData, (d) => d.duas)]);

    // Line generators
    const valueline = line<DuaEntry>()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.duas));

    const valueline2 = line<DuaEntry>()
      .x((d: any) => x(d.date))
      .y((d: any) => y(d.dtas));

    // Area generators
    const duaArea = area<DuaEntry>()
      .x((d: any) => x(d.date))
      .y0(this.height)
      .y1((d: any) => y(d.duas));

    const dtaArea = area<DuaEntry>()
      .x((d: any) => x(d.date))
      .y0(this.height)
      .y1((d: any) => y(d.dtas));

    // Areas
    const areas = dua_dta_svg.selectAll('.area').data([duaData]).enter();

    areas.append('path').attr('class', 'dua_area').attr('d', duaArea);

    areas.append('path').attr('class', 'dta_area').attr('d', dtaArea);

    // Lines
    dua_dta_svg.append('path').datum(duaData).attr('class', 'line duas').attr('d', valueline);

    dua_dta_svg.append('path').datum(duaData).attr('class', 'line dtas').attr('d', valueline2);

    // Labels & Totals
    dua_dta_svg
      .append('text')
      .attr('transform', `translate(${this.width + 3},${y(duaData[duaData.length - 1].duas)})`)
      .attr('dy', '.35em')
      .attr('class', 'duas')
      .text(`DUAs (${duaData[duaData.length - 1].duas})`);

    dua_dta_svg
      .append('text')
      .attr('transform', `translate(${this.width + 3},${y(duaData[duaData.length - 1].dtas)})`)
      .attr('dy', '.35em')
      .attr('class', 'dtas')
      .text(`DTAs (${duaData[duaData.length - 1].dtas})`);

    // Axes
    dua_dta_svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(
        axisBottom(x).tickFormat((date: any) =>
          timeYear(date) < date ? timeFormat('%b')(date) : timeFormat('%Y')(date)
        )
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    dua_dta_svg.append('g').call(axisLeft(y).ticks(5));

    // Tooltip line
    const tooltipLine = dua_dta_svg.append('line').attr('stroke', 'black').style('display', 'none');

    // Tooltip setup
    const dua_dta_focus = dua_dta_svg.append('g').attr('class', 'dua_dta_focus').style('display', 'none');

    dua_dta_focus
      .append('rect')
      .attr('class', 'tooltip')
      .attr('height', 70)
      .attr('x', 10)
      .attr('y', -22)
      .attr('rx', 4)
      .attr('ry', 4);

    // Tooltip texts
    dua_dta_focus.append('text').attr('class', 'tooltip-date_dta_dua').attr('x', 18).attr('y', -2);
    dua_dta_focus.append('text').attr('x', 18).attr('y', 18).text('DUAs:');
    dua_dta_focus.append('text').attr('x', 18).attr('y', 30).text('DTAs:');
    dua_dta_focus.append('text').attr('class', 'tooltip-duas').attr('x', 60).attr('y', 18);
    dua_dta_focus.append('text').attr('class', 'tooltip-dtas').attr('x', 60).attr('y', 30);

    // Tooltip interactions
    dua_dta_svg
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        dua_dta_focus.style('display', null);
        tooltipLine.style('display', null);
      })
      .on('mouseout', () => {
        dua_dta_focus.style('display', 'none');
        tooltipLine.style('display', 'none');
      })
      .on('mousemove', (event) => {
        const [mouseX, mouseY] = pointer(event);
        const x0 = x.invert(mouseX);
        const bisectDate = bisector((d: any) => d.date).left;
        const i = bisectDate(duaData, x0, 1);
        const d0 = duaData[i - 1];
        const d1 = duaData[i];
        // @ts-ignore
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        dua_dta_focus.attr('transform', `translate(${x(d.date)},${mouseY})`);
        dua_dta_focus.select('.tooltip-date_dta_dua').text(timeFormat('%m/%d/%y')(d.date));
        dua_dta_focus.select('.tooltip-duas').text(d.duas);
        dua_dta_focus.select('.tooltip-dtas').text(d.dtas);

        tooltipLine
          .attr('transform', `translate(${x(d.date)},0)`)
          .attr('y1', 0)
          .attr('y2', this.height);
      });
  }
}
