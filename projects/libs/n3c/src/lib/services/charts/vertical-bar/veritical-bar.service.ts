import {Injectable} from '@angular/core';
import {select} from 'd3-selection';
import {scaleBand, scaleLinear} from 'd3-scale';
import {axisBottom, axisLeft} from 'd3-axis';
import {max} from 'd3-array';

export interface BarChartConfig {
  width?: number;
  height?: number;
  margin?: {top: number; right: number; bottom: number; left: number};
  barColor?: string;
  axisColor?: string;
  tooltip?: boolean;
}

@Injectable()
export class VerticalBarService {
  private defaultConfig: BarChartConfig = {
    width: 800,
    height: 400,
    margin: {top: 20, right: 30, bottom: 50, left: 40},
    barColor: 'steelblue',
    axisColor: '#333',
    tooltip: true
  };

  constructor() {}

  draw(data: {category: string; value: number}[], el: HTMLElement, userConfig: BarChartConfig = {}): void {
    // Merge user config with default config
    const config = {...this.defaultConfig, ...userConfig};

    const {margin, barColor, axisColor, tooltip} = config;

    const container = select(el);

    container.select('svg').remove();

    const renderChart = () => {
      const containerWidth = el.clientWidth || config.width!;
      const containerHeight = el.clientHeight || config.height!;

      const chartWidth = containerWidth - margin!.left - margin!.right;
      const chartHeight = containerHeight - margin!.top - margin!.bottom;

      // Remove existing SVG
      container.select('svg').remove();

      // Create responsive SVG
      const svg = container
        .append('svg')
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append('g')
        .attr('transform', `translate(${margin!.left},${margin!.top})`);

      // Set scales
      const x = scaleBand()
        .domain(data.map((d) => d.category))
        .range([0, chartWidth])
        .padding(0.2);

      const y = scaleLinear()
        .domain([0, max(data, (d) => d.value) || 0])
        .nice()
        .range([chartHeight, 0]);

      // Add X axis
      svg
        .append('g')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('fill', axisColor!);

      // Add Y axis
      svg.append('g').call(axisLeft(y).ticks(5)).style('color', axisColor!);

      // Add bars
      const bars = svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.category)!)
        .attr('y', (d) => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', (d) => chartHeight - y(d.value))
        .attr('fill', barColor!);

      // Add tooltips
      if (tooltip) {
        const tooltipDiv = container
          .append('div')
          .style('position', 'absolute')
          .style('background', '#fff')
          .style('border', '1px solid #ccc')
          .style('padding', '5px')
          .style('border-radius', '4px')
          .style('box-shadow', '0px 0px 5px rgba(0,0,0,0.3)')
          .style('visibility', 'hidden')
          .style('pointer-events', 'none')
          .style('font-size', '12px');

        bars
          .on('mouseover', (event, d) => {
            tooltipDiv.style('visibility', 'visible').text(`Category: ${d.category}, Value: ${d.value}`);
          })
          .on('mousemove', (event) => {
            tooltipDiv.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
          })
          .on('mouseout', () => {
            tooltipDiv.style('visibility', 'hidden');
          });
      }
    };

    renderChart();
    window.addEventListener('resize', renderChart);
  }
}
