import {Injectable} from '@angular/core';
import {select, selectAll} from 'd3-selection';
import type {Selection} from 'd3-selection';
import {scaleLinear, scaleBand} from 'd3-scale';
import {arc, pie, symbol, symbolCircle} from 'd3-shape';
import type {PieArcDatum} from 'd3-shape';
import {max, range} from 'd3-array';
import 'd3-transition';

@Injectable()
export class PieBarService {
  projection: any;

  private width!: number;
  private height!: number;
  private border!: number;
  private margin = {top: 10, right: 10, bottom: 10, left: 10};
  path: any;
  zoom: any;
  svg: any;

  constructor() {}

  private nFormatter(num: number, digits: number): string {
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

  drawBarChart(
    element: HTMLElement,
    data: any[],
    colors: string[],
    properties: {
      valueLabelWidth: number;
      barHeight: number;
      barLabelPadding: number;
      gridLabelHeight: number;
      gridChartOffset: number;
      maxBarWidth: number;
      min_height: number;
      ordered: number;
      barSpacing: number;
      legendLabel: string;
      groupName?: string;
    },
    onClick?: (payload: {label: string; groupName: string}) => void
  ): void {
    const {valueLabelWidth, barHeight, barLabelPadding, gridLabelHeight, gridChartOffset, barSpacing} = properties;

    const barValue = (d: any) => parseFloat(d.count);
    const barLabel = (d: any) => d.abbrev;

    if (properties.ordered && properties.ordered === 1) {
      data.sort((a: any, b: any) => parseFloat(b.count) - parseFloat(a.count));
    }

    select(element).select('svg').remove();

    const newWidth = element.getBoundingClientRect().width;

    const filteredData = [...data];
    filteredData.sort((a, b) => a.abbrev.localeCompare(b.abbrev));

    const yScale = scaleBand()
      .domain(range(0, filteredData.length).map(String))
      .range([0, filteredData.length * barHeight]);

    const y = (i: number) => yScale(i.toString())!;
    const yText = (_: any, i: number) => yScale(i.toString())! + yScale.bandwidth() / 2;

    const chartHeight = Math.max(
      gridLabelHeight + gridChartOffset + filteredData.length * barHeight,
      properties.min_height
    );

    const svg = select(element).append('svg').attr('width', newWidth).attr('height', chartHeight);
    const labelsContainer = svg.append('g').attr('transform', `translate(0,${gridLabelHeight + gridChartOffset})`);

    labelsContainer
      .selectAll('text')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('y', yText)
      .attr('stroke', 'none')
      .attr('fill', '#3c3c3d')
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(barLabel);

    const maxLabelWidth = max(labelsContainer.selectAll('text').nodes(), (node: any) => node.getBBox().width) ?? 0;

    labelsContainer.attr('transform', `translate(${maxLabelWidth},${gridLabelHeight + gridChartOffset})`);

    const barsContainer = svg
      .append('g')
      .attr('transform', `translate(${maxLabelWidth + barLabelPadding},${gridLabelHeight + gridChartOffset})`);

    const finalMaxBarWidth = newWidth - maxLabelWidth - barLabelPadding - valueLabelWidth;

    const x = scaleLinear()
      .domain([0, max(filteredData, barValue) ?? 0])
      .range([0, finalMaxBarWidth]);

    // Alternating row backgrounds
    barsContainer
      .selectAll('rect.background')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'background')
      .attr('y', (_, i) => y(i) ?? 0)
      .attr('height', yScale.bandwidth())
      .attr('width', Math.max(0, finalMaxBarWidth))
      .attr('fill', (_, i) => (i % 2 === 0 ? '#f1f1f1' : 'none'));

    // Data bars
    barsContainer
      .selectAll('rect.bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (_, i) => y(i) ?? 0)
      .attr('rx', 2)
      .attr('height', yScale.bandwidth())
      .attr('width', 0)
      .attr('stroke', 'white')
      .attr('fill', (_, i: number) => colors[i % colors.length])
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onClick && properties.groupName) {
          onClick({label: d.abbrev, groupName: properties.groupName});
        }
      })
      .on('mousemove', (event, d) => {
        selectAll('.d3-tooltip').remove();

        // Append the tooltip within the chart element
        select(element)
          .append('div')
          .attr('class', 'd3-tooltip')
          .style('opacity', 0.8)
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('color', 'rgba(0, 0, 0, 0.7)')
          .style('outline', '1px solid black')
          .style('padding', '4px')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`).html(`
            <strong>Label:</strong> ${d.abbrev}<br>
            <strong>Count:</strong> ${d.count}
          `);
      })
      .on('mouseout', () => selectAll('.d3-tooltip').remove())
      .transition()
      .duration(1000)
      .attr('width', (d) => Math.max(0, x(barValue(d))));

    // Value labels at end of bars
    barsContainer
      .selectAll('text')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('x', (d) => x(barValue(d)))
      .attr('y', yText)
      .attr('dx', 3)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#3c3c3d')
      .attr('stroke', 'none')
      .text((d) => this.nFormatter(barValue(d), 2));
  }

  drawPercentageBarChart(
    element: HTMLElement,
    data: any[],
    colors: string[],
    properties: {
      valueLabelWidth: number;
      barHeight: number;
      barLabelPadding: number;
      gridLabelHeight: number;
      gridChartOffset: number;
      maxBarWidth: number;
      min_height: number;
      ordered: number;
      barSpacing: number;
      legendLabel: string;
      groupName?: string;
    },
    onClick?: (payload: {label: string; groupName: string}) => void
  ): void {
    const {valueLabelWidth, barHeight, barLabelPadding, gridLabelHeight, gridChartOffset, maxBarWidth, barSpacing} =
      properties;

    const barLabel = (d: any) => d.abbrev;
    const barValue = (d: any) => parseFloat(d.count);

    if (properties.ordered && properties.ordered === 1) {
      data.sort((a: any, b: any) => parseFloat(b.count) - parseFloat(a.count));
    }

    select(element).select('svg').remove();

    const newWidth = element.getBoundingClientRect().width;

    const filteredData = [...data];
    filteredData.sort((a, b) => a.abbrev.localeCompare(b.abbrev));

    const yScale = scaleBand()
      .domain(range(0, filteredData.length).map(String))
      .range([0, filteredData.length * (barHeight + barSpacing)])
      .paddingInner(0.2);

    const y = (i: number) => yScale(i.toString())!;
    const yText = (_: any, i: number) => yScale(i.toString())! + yScale.bandwidth() / 2;

    // Adjust the SVG height to allow space for the labels at the bottom
    const chartHeight = Math.max(
      gridLabelHeight + gridChartOffset + filteredData.length * (barHeight + barSpacing),
      properties.min_height
    );

    const rightMargin = 40;
    const totalWidth = newWidth + rightMargin;
    const marginBottom = 40;
    const totalHeight = chartHeight + marginBottom;

    const chart = select(element).append('svg').attr('width', totalWidth).attr('height', totalHeight);

    const labelsContainer = chart.append('g').attr('transform', `translate(0,${gridLabelHeight + gridChartOffset})`);

    labelsContainer
      .selectAll('text')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('y', yText)
      .attr('stroke', 'none')
      .attr('fill', '#3c3c3d')
      .attr('dy', '.35em')
      .attr('text-anchor', 'end')
      .text(barLabel);

    const maxLabelWidth = max(labelsContainer.selectAll('text').nodes(), (node: any) => node.getBBox().width) ?? 0;

    labelsContainer.attr('transform', `translate(${maxLabelWidth},${gridLabelHeight + gridChartOffset})`);

    const barsContainer = chart
      .append('g')
      .attr('transform', `translate(${maxLabelWidth + barLabelPadding},${gridLabelHeight + gridChartOffset})`);

    const finalMaxBarWidth = newWidth - maxLabelWidth - barLabelPadding - valueLabelWidth - rightMargin;
    const x = scaleLinear().domain([0, 100]).range([0, finalMaxBarWidth]);

    // Background bars
    barsContainer
      .selectAll('rect.background')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'background')
      .attr('y', (_, i) => y(i) ?? 0)
      .attr('rx', 2)
      .attr('height', yScale.bandwidth())
      .attr('width', finalMaxBarWidth)
      .attr('fill', '#f1f1f1');

    // Data bars
    barsContainer
      .selectAll('rect.bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (_, i) => y(i) ?? 0)
      .attr('rx', 2)
      .attr('height', yScale.bandwidth())
      .attr('width', 0)
      .attr('stroke', 'white')
      .attr('fill', (_, i: number) => colors[i % colors.length])
      .on('click', (event, d) => {
        if (onClick && properties.groupName) onClick({label: d.abbrev, groupName: properties.groupName});
      })
      .on('mousemove', (event, d) => {
        selectAll('.d3-tooltip').remove();
        select(element)
          .append('div')
          .attr('class', 'd3-tooltip')
          .style('opacity', 0.8)
          .style('position', 'absolute')
          .style('background-color', 'white')
          .style('color', 'rgba(0,0,0,0.7)')
          .style('outline', '1px solid black')
          .style('padding', '4px')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`).html(`
          <strong>Label:</strong> ${d.abbrev}<br>
          <strong>Count:</strong> ${d.count}<br>
          ${d.percent !== undefined ? `<strong>Percent:</strong> ${d.percent.toFixed(2)}%` : ''}
        `);
      })
      .on('mouseout', () => selectAll('.d3-tooltip').remove())
      .transition()
      .duration(1000)
      .attr('width', (d: any) => Math.min(x(d.percent), finalMaxBarWidth));

    // Value labels
    barsContainer
      .selectAll('text')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('x', (d) => Math.min(x(d.percent), finalMaxBarWidth))
      .attr('y', yText)
      .attr('dx', 3)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#3c3c3d')
      .attr('stroke', 'none')
      .text((d) => `${d.percent.toFixed(2)}%`);

    // Percentage axis labels
    const lastBarY = y(filteredData.length - 1) + yScale.bandwidth();
    const labelY = lastBarY + 20;
    const labelX0 = maxLabelWidth + barLabelPadding;
    const labelX50 = labelX0 + finalMaxBarWidth / 2;
    const labelX100 = labelX0 + finalMaxBarWidth;

    chart
      .append('text')
      .attr('x', labelX0)
      .attr('y', labelY)
      .attr('fill', '#000')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('0%');

    chart
      .append('text')
      .attr('x', labelX50)
      .attr('y', labelY)
      .attr('fill', '#000')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('50%');

    chart
      .append('text')
      .attr('x', labelX100)
      .attr('y', labelY)
      .attr('fill', '#000')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text('100%');

    // Center "Percent of Total" label directly under the 50% label
    chart
      .append('text')
      .attr('x', labelX50)
      .attr('y', labelY + 20)
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .text('Percent of Total');
  }

  // this is used in the pie and donut charts below to prevent label overlap
  relaxLabels(textLabels: any, lines: any) {
    const alpha = 0.5;
    const spacing = 15;

    const relax = () => {
      let again = false;
      textLabels.each((d: any, i: number, nodes: any[]) => {
        const a = nodes[i];
        const da = select(a);
        const y1 = parseFloat(da.attr('y'));
        textLabels.each((d: any, j: number, nodes: any[]) => {
          const b = nodes[j];
          if (a === b) return;
          const db = select(b);
          if (da.attr('text-anchor') !== db.attr('text-anchor')) return;
          const y2 = parseFloat(db.attr('y'));
          const deltaY = y1 - y2;
          if (Math.abs(deltaY) > spacing) return;
          again = true;
          const sign = deltaY > 0 ? 1 : -1;
          const adjust = sign * alpha;
          da.attr('y', y1 + adjust);
          db.attr('y', y2 - adjust);
        });
      });

      if (again) {
        lines.attr('y2', (d: any, i: number) => textLabels.nodes()[i].getAttribute('y'));
        setTimeout(relax, 20);
      }
    };

    relax();
  }

  drawPieChart(
    element: HTMLElement,
    data: {abbrev: string; count: number; percent: number}[],
    colors: string[],
    options: {width: number; height: number; radius: number}
  ): void {
    const {width, height, radius} = options;
    const margin = 30; // Margin for label space

    // Clear any existing content
    select(element).selectAll('*').remove();

    // Set up SVG with adjusted width to center the chart under the title
    const adjustedWidth = width * 0.8; // Adjust the width to make it narrower
    const svg = select(element)
      .append('svg')
      .attr('viewBox', `0 0 ${radius * 2 + 100} ${radius * 2 + 100}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${radius + 50}, ${radius + 50})`);

    const pieFn = pie<{abbrev: string; count: number; percent: number}>()
      .value((d) => d.count)
      .sort(null);

    const arcFn = arc<PieArcDatum<{abbrev: string; count: number; percent: number}>>()
      .outerRadius(radius)
      .innerRadius(0);

    const outerArc = arc<PieArcDatum<{abbrev: string; count: number; percent: number}>>()
      .outerRadius(radius * 0.7)
      .innerRadius(radius * 0.7);

    // Draw the slices
    svg
      .selectAll('path')
      .data(pieFn(data))
      .enter()
      .append('path')
      .attr('d', arcFn)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    svg.selectAll('path').each(function (_, i) {
      const d = select(this).datum() as PieArcDatum<{abbrev: string; count: number; percent: number}>;
    });

    svg
      .selectAll('.label-line')
      .data(pieFn(data))
      .enter()
      .append('line')
      .attr('x1', (d) => arcFn.centroid(d as PieArcDatum<{abbrev: string; count: number; percent: number}>)![0])
      .attr('y1', (d) => arcFn.centroid(d as PieArcDatum<{abbrev: string; count: number; percent: number}>)![1])
      .attr('x2', (d) => outerArc.centroid(d as PieArcDatum<{abbrev: string; count: number; percent: number}>)![0])
      .attr('y2', (d) => outerArc.centroid(d as PieArcDatum<{abbrev: string; count: number; percent: number}>)![1])
      .attr('stroke', 'black')
      .attr('class', 'label-line');

    const textLabels = svg
      .selectAll('.label-text')
      .data(pieFn(data))
      .enter()
      .append('text')
      .attr('x', (d) => outerArc.centroid(d as PieArcDatum<{abbrev: string; count: number; percent: number}>)![0])
      .attr('y', (d) => outerArc.centroid(d as PieArcDatum<{abbrev: string; count: number; percent: number}>)![1])
      .attr('text-anchor', (d) =>
        outerArc.centroid(d as PieArcDatum<{abbrev: string; count: number; percent: number}>)![0] > 0 ? 'start' : 'end'
      )
      .style('font-size', '14px')
      .style('fill', 'black')
      .text((d) => `${d.data.abbrev} (${d.data.percent.toFixed(1)}%)`);

    // Use relaxLabels to manage any label overlaps
    this.relaxLabels(textLabels, svg.selectAll('.label-line'));
  }

  drawDonutChart(
    element: HTMLElement,
    data: {abbrev: string; count: number; percent: number}[],
    colors: string[],
    options: {groupName?: string; width: number; height: number; radius: number; donutWidth: number},
    onClick?: (payload: {label: string; groupName: string}) => void
  ): void {
    const {width, height, radius, donutWidth} = options;
    const margin = 75; // Margin for label space

    // Clear any existing content
    select(element).selectAll('*').remove();

    // Setup SVG with a border for visualization
    const svg = select(element)
      .append('svg')
      .attr('width', width + 2 * margin)
      .attr('height', height + 2 * margin)
      .append('g')
      .attr('transform', `translate(${(width + 2 * margin) / 2}, ${(height + 2 * margin) / 2})`);

    const pieFn = pie<{abbrev: string; count: number; percent: number}>()
      .value((d) => d.count)
      .sort(null);

    const arcFn = arc<PieArcDatum<{abbrev: string; count: number; percent: number}>>()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius * 0.8)
      .padAngle(0.02)
      .cornerRadius(8);

    const outerArc = arc<PieArcDatum<{abbrev: string; count: number; percent: number}>>()
      .innerRadius(radius * 1.0)
      .outerRadius(radius * 1.0);

    svg
      .selectAll('path')
      .data(pieFn(data))
      .enter()
      .append('path')
      .attr('d', arcFn)
      .attr('fill', (d, i) => colors[i % colors.length])
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
      .on('click', (event, d) => {
        if (onClick && options.groupName) {
          onClick({label: d.data.abbrev, groupName: options.groupName});
        }
      })
      .on('mouseover', function () {
        // Enlarge the slice slightly on hover
        select(this).transition().duration(200).attr('transform', 'scale(1.05)'); // Scale up to 105%
      })
      .on('mouseout', function () {
        // Reset the slice size when the mouse leaves
        select(this).transition().duration(200).attr('transform', 'scale(1)'); // Reset scale
      });

    // Draw the lines
    const lines = svg
      .selectAll('.lines')
      .data(pieFn(data))
      .enter()
      .append('line')
      .attr('x1', (d) => arcFn.centroid(d)[0])
      .attr('y1', (d) => arcFn.centroid(d)[1])
      .attr('x2', (d) => outerArc.centroid(d)[0] * 1.2)
      .attr('y2', (d) => outerArc.centroid(d)[1] * 1.2)
      .attr('class', 'label-line')
      .attr('stroke', 'black');

    const textLabels = svg
      .selectAll('.label')
      .data(pieFn(data))
      .enter()
      .append('text')
      .attr('x', (d) => outerArc.centroid(d)[0] * 1.3) // Further offset for label positioning
      .attr('y', (d) => outerArc.centroid(d)[1] * 1.3)
      .attr('text-anchor', (d) => (outerArc.centroid(d)[0] > 0 ? 'start' : 'end'))
      .attr('class', 'label-text')
      .style('font-size', '14px') // Larger font size for better readability
      .text((d) => `${d.data.abbrev} (${d.data.percent.toFixed(1)}%)`);

    // Use relaxLabels to manage any label overlaps
    this.relaxLabels(textLabels, lines);
  }

  drawDonutCountsInside(
    element: HTMLElement,
    data: {key: string; count: number}[],
    colorByKey: Record<string, string>,
    options: {size?: number; innerRatio?: number; fontSize?: number; minLabelAngle?: number} = {}
  ): void {
    const size = options.size ?? 380;
    const radius = size / 2;
    const innerRatio = options.innerRatio ?? 0.3;
    const innerR = radius * innerRatio;
    const outerR = radius * 0.96;
    const fontSize = options.fontSize ?? 16;
    const minLabelAngle = options.minLabelAngle ?? 0.06;

    if (!element) {
      console.error('drawDonutCountsInside: element is required');
      return;
    }
    if (!Array.isArray(data) || data.length === 0) {
      console.error('drawDonutCountsInside: data is empty');
      return;
    }

    select(element).selectAll('*').remove();

    const clean = (data || [])
      .map((d) => ({key: (d.key || '').toUpperCase(), count: Number(d.count) || 0}))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);

    if (!clean.length) return;

    const svg = select(element)
      .append('svg')
      .attr('viewBox', `0 0 ${size} ${size}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block');

    const g = svg.append('g').attr('transform', `translate(${radius}, ${radius})`);

    const pieFn = pie<{key: string; count: number}>()
      .value((d) => d.count)
      .sort(null);

    const arcFn = arc<PieArcDatum<{key: string; count: number}>>()
      .innerRadius(innerR)
      .outerRadius(outerR)
      .padAngle(0)
      .cornerRadius(0);

    const labelR = innerR + (outerR - innerR) * 0.65;
    const labelArc = arc<PieArcDatum<{key: string; count: number}>>().innerRadius(labelR).outerRadius(labelR);
    const arcs = pieFn(clean);

    g.selectAll('path.slice')
      .data(arcs)
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arcFn)
      .attr('fill', (d) => colorByKey[d.data.key])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    g.selectAll('text.count')
      .data(arcs)
      .enter()
      .append('text')
      .attr('class', 'count')
      .attr('transform', (d) => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', `${fontSize}px`)
      .style('font-weight', 700)
      .style('fill', '#fff')
      .style('pointer-events', 'none')
      .style('display', (d) => (d.endAngle - d.startAngle >= minLabelAngle ? null : 'none'))
      .text((d) => d.data.count.toString());
  }
}
