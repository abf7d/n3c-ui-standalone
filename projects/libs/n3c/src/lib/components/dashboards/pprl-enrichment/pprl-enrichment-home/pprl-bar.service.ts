import {inject, Injectable} from '@angular/core';
import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {CmsBarFeedTotals, cmsVisProps} from '@odp/n3c/lib/models/pprl-enrichment';
import {Router} from '@angular/router';
@Injectable()
export class PprlBarService {
  private router = inject(Router);

  drawChart(summaryData: CmsBarFeedTotals, el: any) {
    // set the dimensions and margins of the graph
    const dataTotals = summaryData;
    const pprl_margin = {top: 0, right: 0, bottom: 0, left: 0},
      pprl_width = 1145 - pprl_margin.left - pprl_margin.right,
      pprl_height = 150 - pprl_margin.top - pprl_margin.bottom;

    const gap = 8;
    const offset = 175;
    const data = [
      {...dataTotals.mortality, ...cmsVisProps.mortality},
      {...dataTotals.medicare, ...cmsVisProps.medicare},
      {...dataTotals.medicaid, ...cmsVisProps.medicaid},
      {...dataTotals.viral, ...cmsVisProps.viral}
    ];
    const dataRange =
      max(
        data.map(function (d) {
          return Math.max(d.count);
        })
      ) ?? 0;

    const barWidth = pprl_height / data.length,
      yScale = scaleLinear()
        .domain([0, data.length])
        .range([0, pprl_height - pprl_margin.top]),
      total = scaleLinear()
        .domain([0, dataRange])
        .range([0, pprl_width - offset]);

    /* main panel */
    const vis = select(el).append('svg').attr('viewBox', [0, 0, 1200, 150]);

    const bar = vis
      .selectAll('g.bar')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (yScale(i) + pprl_margin.top) + ')';
      });

    bar
      .append('a')
      .attr('href', function () {
        return 'javascript:void(0)';
      })
      .on('click', (event, d) => {
        this.router.navigate(['./dashboard/pprl-enrichment/home'], {fragment: d.viz_id});
      })
      .append('text')
      .attr('class', 'below')
      .attr('x', pprl_margin.left + 12)
      .attr('dy', 20)
      .attr('text-anchor', 'left')
      .text(function (d) {
        return d.label + ' (' + d.count.toLocaleString() + ')';
      });

    bar
      .append('a')
      .attr('href', function () {
        return 'javascript:void(0)';
      })
      .on('click', (event, d) => {
        this.router.navigate(['./dashboard/pprl-enrichment/home'], {fragment: d.viz_id});
      })
      .append('rect')
      .attr('transform', function (d, i) {
        return 'translate(' + offset + ',0)';
      })
      .style('cursor', 'pointer')
      .attr('class', 'pprllongbar_bar')
      .attr('width', function (d) {
        return total(d.count);
      })
      .attr('height', barWidth - gap)
      .attr('rx', 5)
      .attr('fill', function (d) {
        return d.color;
      })
      .attr('x', pprl_margin.left);
  }
}
