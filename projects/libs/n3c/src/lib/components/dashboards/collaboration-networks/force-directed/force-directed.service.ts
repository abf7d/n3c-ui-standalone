import {Injectable} from '@angular/core';
import {select} from 'd3-selection';
import {scaleOrdinal} from 'd3-scale';
import {forceSimulation, forceLink, forceCollide, forceManyBody, forceCenter, forceX, forceY} from 'd3-force';
import {drag} from 'd3-drag';
import 'd3-transition';
import {OrgSite} from '../../../../models/org-site';

@Injectable()
export class ForceDirectedService {
  charge = -350;
  width = 1900;
  height = 1200;
  chartWidth: any;
  chartHeight: any;
  margin = {top: 0, left: 0, bottom: 0, right: 0};
  svg: any;
  chartLayer: any;
  simulation: any;
  forceCenter: any;
  tooltip: any;
  colorScale: any;
  legendDiv: any;
  orgSites: OrgSite[] = [];

  constructor() {}

  public initChart(el: any, legendEl: any) {
    this.legendDiv = select(legendEl).append('div').attr('class', 'row');
    this.svg = select(el).append('svg');
    this.chartLayer = this.svg.append('g').classed('chartLayer', true);

    this.tooltip = select('body').append('div').attr('class', 'tooltip').style('opacity', 0);
    this.colorScale = scaleOrdinal()
      .domain(['N3C', 'CTSA', 'GOV', 'CTR', 'COM', 'UNAFFILIATED', 'REGIONAL', 'X1', 'X2', 'X3'])
      .range([
        '#007bff',
        '#8406D1',
        '#09405A',
        '#AD1181',
        '#ffa600',
        '#ff7155',
        '#a6a6a6',
        '8B8B8B',
        'black',
        'yellow'
      ]);
  }

  public drawChart(el: any, projectGraph: any, orgSites: OrgSite[]) {
    if (projectGraph == null) return;
    this.svg.selectAll('*').remove();
    this.tooltip.selectAll('*').remove();
    this.legendDiv.selectAll('*').remove();
    this.chartLayer = this.svg.append('g').classed('chartLayer', true);

    this.chartWidth = this.width - (this.margin.left + this.margin.right);
    this.chartHeight = this.height - (this.margin.top + this.margin.bottom);
    this.orgSites = orgSites;

    this.setSize(this.width);
    this.drawGraph(projectGraph);
  }

  private setSize(newWidth: number) {
    this.width = newWidth;
    this.margin = {top: 0, left: 0, bottom: 0, right: 0};

    this.chartWidth = this.width - (this.margin.left + this.margin.right);
    this.chartHeight = this.height - (this.margin.top + this.margin.bottom);

    this.svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    this.chartLayer
      .attr('width', this.chartWidth)
      .attr('height', this.chartHeight)
      .attr('transform', 'translate(' + [this.margin.left, this.margin.top] + ')');

    if (this.forceCenter != null) {
      this.forceCenter.x(this.chartWidth / 2);
      this.forceCenter.y(this.chartHeight / 2);
      this.simulation.restart();
    }
  }

  private drawGraph(data: any) {
    this.forceCenter = forceCenter(this.chartWidth / 2, this.chartHeight / 2);
    this.simulation = forceSimulation()
      .force(
        'link',
        forceLink().id((d: any) => d.index!)
      )
      .force('collide', forceCollide((d: any) => d.score + 8).iterations(16))
      .force('charge', forceManyBody())
      .force('center', this.forceCenter)
      .force('y', forceY(0))
      .force('x', forceX(0));

    var link = this.svg.append('g').attr('class', 'links').selectAll('line').data(data.links).enter().append('line');

    link
      .attr('class', 'link')
      .on('mouseover.tooltip', (event: any, d: any) => {
        this.tooltip.transition().duration(300).style('opacity', 0.8);
        this.tooltip
          .html('Source:' + d.source.name + '<p/>Target:' + d.target.name + '<p/>Strength:' + d.value)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseout.tooltip', () => {
        this.tooltip.transition().duration(100).style('opacity', 0);
      })
      .on('mouseout.fade', (e: any, d: any) => fade(d, 1))
      .on('mousemove', (event: any) => {
        this.tooltip.style('left', event.pageX + 'px').style('top', event.pageY + 10 + 'px');
      });
    var node = this.svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', (d: any) => d.score)
      .attr('fill', (d: any) => this.colorScale(d.group))
      .on('mouseover.tooltip', (event: any, d: any) => {
        this.tooltip.transition().duration(300).style('opacity', 0.8);
        this.tooltip
          .html((d.group == 'N3C' ? d.url + ' - ' : '') + d.name)
          .style('left', event.pageX + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseover.fade', (e: any, d: any) => fade(d, 0.1))
      .on('mouseout.tooltip', () => {
        this.tooltip.transition().duration(100).style('opacity', 0);
      })
      .on('mouseout.fade', (e: any, d: any) => fade(d, 1))
      .call(drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));
    const _this = this;

    var ticked = function () {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => (d.x = Math.max(4, Math.min(_this.width - d.score, d.x))))
        .attr('cy', (d: any) => (d.y = Math.max(4, Math.min(_this.height - d.score, d.y))));
    };

    drawColorKey(this.orgSites);
    this.simulation.nodes(data.nodes).on('tick', ticked);
    this.simulation.force('link').links(data.links);

    function dragstarted(event: any, d: any) {
      if (event.active) _this.simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) _this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const linkedByIndex = new Map<string, number>();
    data.links.forEach((d: any) => {
      linkedByIndex.set(d.source.index + ',' + d.target.index, 1);
    });

    function isConnected(a: any, b: any) {
      return (
        linkedByIndex.get(a.index + ',' + b.index) || linkedByIndex.get(b.index + ',' + a.index) || a.index === b.index
      );
    }

    function fade(d: any, opacity: number) {
      node.style('fill-opacity', (o: any) => {
        const thisOpacity = isConnected(d, o) ? 1 : opacity;
        return thisOpacity;
      });

      link.style('stroke-opacity', (ox: any) => (ox.source === d || ox.target === d ? 1 : opacity));
    }

    function drawColorKey(legendData: any) {
      var legend_div = _this.legendDiv;

      legend_div
        .selectAll('.new_legend')
        .data(legendData)
        .enter()
        .append('div')
        .attr('class', 'col col-6 col-lg-4')
        .html(function (d: any, i: number) {
          return '<i class="fas fa-circle" style="color:' + _this.colorScale(legendData[i].id) + ';"></i> ' + d.label;
        });
    }
  }
}
