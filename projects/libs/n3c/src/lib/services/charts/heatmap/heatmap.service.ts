import {Injectable} from '@angular/core';
import {ChartLink, ChartNode, HeatmapDataChart, HeatmapProperties} from '../../../models/substance-use-heatmap';
import {select, selectAll} from 'd3-selection';
import {scaleBand, scaleThreshold} from 'd3-scale';
import {axisLeft, axisTop} from 'd3-axis';
import {max} from 'd3-array';

@Injectable()
export class HeatmapService {
  public initChart() {}
  public drawChart(properties: HeatmapProperties, grpahData: HeatmapDataChart) {
    const graph = grpahData;

    var source = graph.nodes.filter((site, i) => {
      if (site.group == properties.source_label) {
        site.index = i;
        return true;
      }
      return false;
    });

    var target = graph.nodes.filter(function (site, i) {
      if (site.group == properties.target_label) {
        site.index = i - source.length;
        return true;
      }
      return false;
    });

    var links = graph.links.filter(function (site, i) {
      site.target = site.target - source.length;
      return true;
    });

    draw(properties.cell_size, source, target, links);

    function draw(cell_size: number, source: ChartNode[], target: ChartNode[], links: ChartLink[]) {
      var margin = properties.margin,
        width = cell_size * target.length,
        height = cell_size * source.length;

      var sourceKeys_by_name = source.map((d) => d.name);
      var targetKeys_by_name = target.map((d) => d.name);

      var source_map = new Map<number, ChartNode>(source.map((d) => [d.index!, d]));
      var target_map = new Map<number, ChartNode>(target.map((d) => [d.index!, d]));

      source.sort(function (x, y) {
        return y.score - x.score;
      });

      target.sort(function (x, y) {
        return y.score - x.score;
      });

      source.filter(function (site, i) {
        site.new_index = i;
        return true;
      });

      target.filter(function (site, i) {
        site.new_index = i;
        return true;
      });

      var sourceKeys_by_freq = [...new Set(source.map((d) => d.name))];
      var targetKeys_by_freq = [...new Set(target.map((d) => d.name))];

      var step2 = Math.round(Math.max(...(links.map((d) => d.value) ?? 0 * 0.2)));

      var step0 = 0;
      var step1 = 1;
      var step2 = Math.round(
        max(links!, function (d) {
          return d!.value;
        })! * 0.2
      );
      var step3 = Math.round(
        max(links, function (d) {
          return d.value;
        })! * 0.4
      );
      var step4 = Math.round(
        max(links, function (d) {
          return d.value;
        })! * 0.6
      );
      var step5 = Math.round(
        max(links, function (d) {
          return d.value;
        })! * 0.8
      );
      var maxstep = Math.round(
        max(links, function (d) {
          return d.value;
        })!
      );

      var x = scaleBand().range([0, width]).domain(targetKeys_by_name).padding(0.05),
        y = scaleBand().range([0, height]).domain(sourceKeys_by_name).padding(0.05),
        z = scaleThreshold<number, string, number>()
          .range(['white', '#EDF6FF', '#B2D4F9', '#77B3F3', '#3B91EC', '#006FE6'])
          .domain([step1, step2, step3, step4, step5]);

      var svg = select(properties.chartEl)
        .append('svg')
        .attr('width', width + margin.left)
        .attr('height', height + margin.top)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      function build_payload(link: ChartLink, source: ChartNode, target: ChartNode) {
        return {
          x: link.target,
          y: link.source,
          value: link.value,
          source: source,
          target: target
        };
      }

      var matrix = new Array(source.length);

      for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(target.length);
        for (var j = 0; j > matrix[i].length; j++) matrix[i][j] = 0;
      }

      links.forEach((link) => {
        const srcNode = source_map.get(link.source);
        const tarNode = target_map.get(link.target);
        const srcIndex = srcNode!.index!;
        const tarIndex = tarNode!.index!;
        matrix[srcIndex][tarIndex] = build_payload(link, srcNode!, tarNode!);
      });

      var tooltip = select('body').append('div').attr('id', 'tooltip').style('opacity', 0).style('font-size', '11px');

      svg.append('rect').attr('class', 'background').attr('width', width).attr('height', height);

      svg
        .append('g')
        .style('font-size', 11)
        .call(axisLeft(y).tickSize(0))
        .attr('class', 'y_axis')
        .attr('stroke-width', 0)
        .select('.domain')
        .remove();

      svg
        .append('g')
        .style('font-size', 11)
        .call(axisTop(x).tickSize(0))
        .attr('class', 'x_axis')
        .attr('stroke-width', 0)
        .selectAll('text')
        .style('text-anchor', 'start')
        .attr('class', 'cell_text')
        .attr('dx', 6)
        .attr('dy', x.bandwidth() / 2)
        .attr('transform', 'rotate(-90)')
        .select('.domain')
        .remove();

      const row = svg.selectAll('.row').data(matrix).enter().append('g').attr('class', 'row');

      const cell = row
        .selectAll('.cell')
        .data((d) => {
          return d;
        })
        .enter()
        .append('g')
        .attr('class', 'cell');

      cell
        .append('rect')
        .attr('class', 'cell_block')
        .attr('x', (d: any) => x(d.target.name)!)
        .attr('y', (d: any) => y(d.source.name)!)
        .attr('width', x.bandwidth() * 0.9)
        .attr('height', y.bandwidth() * 0.9)
        .style('stroke-width', 2)
        .style('stroke', 'none')
        .style('fill', (d: any) => z(d.value)!)
        .on('mouseover', function (event, d: any) {
          selectAll(/*'.row text'*/ '.tick text').classed('active', function (e, i) {
            return d.source.name == e;
          });
          selectAll('.cell_text').classed('active', function (e, i) {
            return d.target.name == e;
          });
          tooltip.style('opacity', 1);
          select(this).style('stroke', 'black').style('opacity', 1);
        })
        .on('mousemove', (event, d: any) => {
          tooltip
            .html(
              properties.source_tooltip_label +
                ': ' +
                d.source.name +
                '<br>' +
                properties.target_tooltip_label +
                ': ' +
                d.target.name +
                '<br>Count: ' +
                nFormatter(d.value, 2)
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY + 10 + 'px');
        })
        .on('mouseleave', function (event, d) {
          selectAll('text').classed('active', false);
          tooltip.style('opacity', 0);
          select(this).style('stroke', 'none').style('opacity', 0.8);
        });

      drawColorKey();

      function nFormatter(num: any, digits: any) {
        if (typeof properties.sub20hack !== 'undefined' && num == properties.sub20hack) return '<20';

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
        var item = lookup
          .slice()
          .reverse()
          .find(function (item) {
            return num >= item.value;
          });
        return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
      }

      // draw color key on to decoupled div
      function drawColorKey() {
        var legend_data = [
          {name: step0.toLocaleString(), value: step0},
          {name: step3.toLocaleString() + ' - ' + (step4 - 1).toLocaleString(), value: step3},
          {name: step1.toLocaleString() + ' - ' + (step2 - 1).toLocaleString(), value: step1},
          {name: step4.toLocaleString() + ' - ' + (step5 - 1).toLocaleString(), value: step4},
          {name: step2.toLocaleString() + ' - ' + (step3 - 1).toLocaleString(), value: step2},
          {name: step5.toLocaleString() + ' - ' + maxstep.toLocaleString(), value: step5}
        ];

        select(properties.legendEl).html('');
        var legend_div = select(properties.legendEl).append('div').attr('class', 'row').attr('id', 'filters');

        legend_div
          .selectAll('.legend-title')
          .data([properties.xaxis_label])
          .enter()
          .append('div')
          .attr('class', 'col col-12')
          .html(function (d) {
            return '<h5>' + d + ' Legend</h5>';
          });

        const legend_item = legend_div
          .selectAll('.new_legend')
          .data(legend_data)
          .enter()
          .append('div')
          .attr('class', 'col col-6')
          .html(function (d, i) {
            if (i == 0) {
              return (
                '<i class="fas fa-square" style="border: 1px solid gray; border-radius: 3px; color:' +
                z(d.value) +
                ';"></i> ' +
                d.name
              );
            } else {
              return '<i class="fas fa-square" style="color:' + z(d.value) + ';"></i> ' + d.name;
            }
          });
      }
    }
  }
}
