import {Injectable} from '@angular/core';
import {select, selectAll} from 'd3-selection';
import {scaleLinear, scalePoint, scaleOrdinal} from 'd3-scale';
import {max, range} from 'd3-array';
import {linkRadial} from 'd3-shape';
import './hive-plot';
import {link} from './hive-plot';
import {Chart} from '../../../models/hive-plot';

@Injectable()
export class RadarPlotService {
  el: any;
  createChart(properties: {
    hiveData: Chart;
    scaling: number;
    color: {[dimension: number]: string[]};
    domTarget: string;
    el: any;
  }): void {
    const data = properties.hiveData;
    this.el = properties.el;
    if (!data) throw new Error('Failed to load data');
    this.initChart(properties, data);
  }

  private initChart(properties: any, data: any): void {
    let innerRadius = 40,
      outerRadius = 400;

    this.drawChart(properties, data, innerRadius, outerRadius);
  }

  private drawChart(properties: any, data: any, innerRadius: number, outerRadius: number): void {
    const nodes = data.nodes;
    const nodeMap = new Map<string, {x: number; y: number}>(
      nodes.map((node: {mapping: string; x: number; y: number}) => [node.mapping, node])
    );
    const links = data.edges;

    const nodeScale = scaleLinear()
      .domain([0, max(nodes, (d: {weight: number}) => d.weight) ?? 0])
      .range([2, 15]);
    const linkScale = scaleLinear()
      .domain([0, max(links, (d: {weight: number}) => d.weight) ?? 0])
      .range([0.15, 1]);
    const groupings = data.axes.length + 1; // Number of groups based on 'axes' array length

    const angle = scalePoint()
      .domain(range(groupings).map(String))
      .range([0, 2 * Math.PI]);
    const radius = scaleLinear().range([innerRadius, outerRadius]);

    const svg = select(this.el)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '-700 -500 1400 1000')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .append('g');

    // Draw axis lines
    svg
      .selectAll('.axis')
      .data(range(groupings))
      .enter()
      .append('line')
      .attr('class', 'axis_line')
      .attr('transform', (d) => `rotate(${this.degrees(angle(d.toString()) ?? 0)})`)
      .attr('x1', radius.range()[0])
      .attr('x2', radius.range()[1]);

    // Draw links with check for undefined nodes
    svg
      .selectAll('.link')
      .data(links)
      .join('path')
      .attr('class', 'link')
      .attr(
        'd',
        (linkRadial() as any)
          .angle((d: any) => {
            const sourceNode = nodeMap.get(d);
            return sourceNode ? (angle(sourceNode.x.toString()) ?? 0) : 0;
          })
          .radius((d: any) => {
            const sourceNode = nodeMap.get(d);
            return sourceNode ? radius(sourceNode.y) : 0;
          })
      )
      .style('stroke', (d: any) => {
        if (d.source && typeof d.source === 'string') {
          const [dimension, value] = d.source.split('-').map(Number);
          if (properties.color[dimension] && properties.color[dimension][value - 1]) {
            return properties.color[dimension][value - 1];
          }
        }
        return '#000'; // Default color if dimension or index is out of bounds
      })
      .style('stroke-opacity', (d: any) => linkScale(d.weight));
    console.log('links');
    svg
      .selectAll('.link')
      .data(links)
      .join('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        console.log('d', d);
        return link()
          .angle((d: any, i: any) => {
            const sourceNode = nodeMap.get(d);
            return sourceNode ? (angle(sourceNode.x.toString()) ?? 0) : 0;
          })
          .radius((d: any, i: any) => {
            const sourceNode = nodeMap.get(d);
            return sourceNode ? radius(sourceNode.y) : 0;
          })(d, 3);
      })

      .style('stroke-opacity', (d: any) => linkScale(d.weight))
      .on('mouseover', function (event, d) {
        return linkMouseover(d);
      });

    // Draw nodes with color check
    svg
      .selectAll<SVGCircleElement, {weight: number; x: number; y: number}[]>('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('transform', (d: any) => `rotate(${this.degrees(angle(d.x.toString()) ?? 0)})`)
      .attr('cx', (d: any) => radius(d.y))
      .attr('r', (d: any) => nodeScale(d.weight))
      .style('fill', (d: any) => {
        if (d.mapping && typeof d.mapping === 'string') {
          const [dimension, value] = d.mapping.split('-').map(Number);
          if (properties.color[dimension] && properties.color[dimension][value - 1]) {
            return properties.color[dimension][value - 1];
          }
        }
        return '#000'; // Default color if dimension or index is out of bounds
      })
      .on('mouseover', function (event, d: any) {
        select(`#${properties.domName}`)
          .append('div')
          .attr('class', 'tooltip')
          .style('opacity', 1)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`)
          .html(`${d.label}<br />${d.weight.toLocaleString()}`);

        svg.selectAll('.link').classed('active', function (p: any) {
          return p.source === d.mapping || p.target === d.mapping;
        });
        select(this).classed('active', true);
      })
      .on('mouseout', () => {
        selectAll('.tooltip').remove();
      });

    // Adding text legend
    console.log('groupsings', range(groupings));
    svg
      .selectAll('labels')
      .data(range(groupings))
      .join('g')
      .attr('transform', (d) => `rotate(${this.degrees(angle(d.toString()) ?? 0)}) translate(${radius(1.2)},0)`)
      .attr('x1', radius.range()[0])
      .attr('x2', radius.range()[1])
      .attr('font-family', 'sans-serif')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .append('text')
      .attr('transform', (d: any) => {
        return 'rotate(' + -this.degrees(angle(d.toString())!) + ')';
      })
      .text(function (d) {
        return data.axes[d];
      });

    function linkMouseover(d: any) {
      svg.selectAll('.link').classed('active', function (p: any) {
        return p === d;
      });
      svg.selectAll('.node').classed('active', function (p: any) {
        return p.mapping === d.source || p.mapping === d.target;
      });
    }
  }

  private degrees(radians: number): number {
    return (radians / Math.PI) * 180 - 90;
  }
}
