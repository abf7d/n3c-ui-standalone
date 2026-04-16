import {Injectable} from '@angular/core';
import {select} from 'd3-selection';
import {pointer} from 'd3-selection';
import {scaleTime, scaleLinear} from 'd3-scale';
import {line, area} from 'd3-shape';
import {axisBottom, axisLeft} from 'd3-axis';
import {extent, max, bisector} from 'd3-array';
import {timeParse, timeFormat} from 'd3-time-format';
import {timeYear} from 'd3-time';
import {format} from 'd3-format';
import {DataPoint, DuaEntry} from '../../../models/admin-models';
@Injectable()
export class InstitutionLineChartService {
  projection: any;
  draw(data2: DuaEntry[], el: any) {
    const reg_margin = {top: 30, right: 100, bottom: 30, left: 50};
    const reg_width = 470 - reg_margin.left - reg_margin.right;
    const reg_height = 160 - reg_margin.top - reg_margin.bottom;

    // Scales
    const reg_x = scaleTime().range([0, reg_width]);
    const reg_y = scaleLinear().range([reg_height, 0]);

    const reg_svg = select(el)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 475 200')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .append('g')
      .attr('transform', `translate(${reg_margin.left},${reg_margin.top})`);

    // Ensure dates are converted
    const data: DataPoint[] = data2.map((d: any) => ({
      date: new Date(d.date),
      registrations: +d.registrations
    }));

    // Domain calculation
    const dateExtent = extent(data, (d) => d.date) as [Date, Date];
    const regMax = max(data, (d) => d.registrations) ?? 0;
    reg_x.domain(dateExtent);
    reg_y.domain([0, regMax]);

    // Line and Area
    const reg_valueline = line<DataPoint>()
      .x((d) => reg_x(d.date))
      .y((d) => reg_y(d.registrations));

    const regArea = area<DataPoint>()
      .x((d) => reg_x(d.date))
      .y0(reg_height)
      .y1((d) => reg_y(d.registrations));

    // Paths
    reg_svg.append('path').datum(data).attr('class', 'reg_area').attr('d', regArea);
    reg_svg.append('path').datum(data).attr('class', 'line registration').attr('d', reg_valueline);

    // Labels & Current Totals
    reg_svg
      .append('text')
      .attr('transform', `translate(${reg_width + 3},${reg_y(data[data.length - 1].registrations)})`)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .attr('class', 'registration')
      .text(`Users: (${data[data.length - 1].registrations})`);

    // Axis
    reg_svg
      .append('g')
      .attr('transform', `translate(0,${reg_height})`)
      .call(
        axisBottom(reg_x)
          // @ts-ignore
          .tickFormat((date) => (timeYear(date) < date ? timeFormat('%b')(date) : timeFormat('%Y')(date)))
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    reg_svg.append('g').call(axisLeft(reg_y).ticks(5));

    // Tooltip elements
    const reg_tooltipLine = reg_svg.append('line').style('display', 'none');
    const reg_focus = reg_svg.append('g').attr('class', 'reg_focus').style('display', 'none');

    reg_focus
      .append('rect')
      .attr('class', 'tooltip')
      .attr('width', 100)
      .attr('height', 50)
      .attr('x', 10)
      .attr('y', -22)
      .attr('rx', 4)
      .attr('ry', 4);

    reg_focus.append('text').attr('class', 'tooltip-date').attr('x', 18).attr('y', -2);
    reg_focus.append('text').attr('x', 18).attr('y', 18).text('Users:');
    reg_focus.append('text').attr('class', 'tooltip-registration').attr('x', 60).attr('y', 18);

    // Overlay & Interaction
    reg_svg
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', reg_width)
      .attr('height', reg_height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        reg_focus.style('display', null);
        reg_tooltipLine.style('display', null);
      })
      .on('mouseout', () => {
        reg_focus.style('display', 'none');
        reg_tooltipLine.style('display', 'none');
      })
      .on('mousemove', reg_mousemove);

    const bisectDate = bisector((d: DataPoint) => d.date).left;
    const formatValue = format(',');
    const dateFormatter = timeFormat('%m/%d/%y');

    function reg_mousemove(event: MouseEvent) {
      const [mouseX, mouseY] = pointer(event);
      const x0 = reg_x.invert(mouseX);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      const d = !d1 || x0.getTime() - d0.date.getTime() < d1.date.getTime() - x0.getTime() ? d0 : d1;

      reg_focus.attr('transform', `translate(${reg_x(d.date)},${mouseY})`);
      reg_focus.select('.tooltip-date').text(dateFormatter(d.date));
      reg_focus.select('.tooltip-registration').text(formatValue(d.registrations));

      reg_tooltipLine
        .attr('stroke', 'black')
        .attr('transform', `translate(${reg_x(d.date)},0)`)
        .attr('y1', 0)
        .attr('y2', reg_height);
    }
  }
}
