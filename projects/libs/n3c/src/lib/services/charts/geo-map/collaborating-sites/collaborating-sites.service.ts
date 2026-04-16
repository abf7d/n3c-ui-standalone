import {Injectable} from '@angular/core';
import {scaleOrdinal, scaleLinear} from 'd3-scale';
import {max} from 'd3-array';

@Injectable()
export class CollaboratingSitesService {
  constructor() {}
  draw(svg: any, projection: any, collaborations: any, edges: any) {
    var node_map = new Map<number, any>(collaborations.sites.map((x: any) => [x.id, x]));
    const collaboration_g = svg.append('g').attr('class', 'layer'); // we need to class this for zooming by the vase code
    var color = scaleOrdinal<string>()
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

    const maxCount = max(collaborations.sites, (d: any) => d.count);
    const nodeScale = scaleLinear()
      .domain([0, +maxCount! as number])
      .range([3, 25]);

    const locationBySite: any[] = [];
    const positions: any[] = [];

    var sites = collaborations.sites.filter(function (site: any) {
      var location = [site.longitude, site.latitude];
      if (projection(location) == undefined) return false;
      locationBySite[site.id] = projection(location);
      positions.push(projection(location));
      return true;
    });

    var edgesList: any[] = [];
    edges.edges.forEach((link: any) => {
      var source = node_map.get(link.source);
      var target = node_map.get(link.target);
      if (source !== undefined && target !== undefined) {
        var count = link.count;
        var source_loc = projection([source.longitude, source.latitude]);
        var target_loc = projection([target.longitude, target.latitude]);
        if (source_loc != undefined && target_loc != undefined)
          edgesList.push({source, source_loc, target, target_loc, count});
      }
    });

    var edgeScale = scaleLinear()
      .domain([
        0,
        max(edgesList, function (d) {
          return d.count;
        })
      ])
      .range([0, 1]);

    var link = collaboration_g
      .selectAll('line')
      .data(edgesList)
      .enter()
      .append('line')
      .attr('class', 'links')
      .style('stroke-opacity', function (d: any) {
        return edgeScale(d.count);
      })
      .attr('x1', function (d: any) {
        return d.source_loc[0];
      })
      .attr('x2', function (d: any) {
        return d.target_loc[0];
      })
      .attr('y1', function (d: any) {
        return d.source_loc[1];
      })
      .attr('y2', function (d: any) {
        return d.target_loc[1];
      });

    function fade(item: any, opacity: any, out: any) {
      link.style('stroke-opacity', function (o: any) {
        if (out) {
          return edgeScale(o.count);
        }
        return o.source == item || o.target == item ? 1 : opacity * edgeScale(o.count);
      });
    }

    function collaborator_count(d: any) {
      var coll_count = 0;
      edges.edges.filter(function (o: any) {
        if (o.source == d.id || o.target == d.id) coll_count = coll_count + 1;
      });
      return coll_count;
    }

    collaboration_g
      .selectAll('circle')
      .data(sites)
      .enter()
      .append('svg:circle')
      .attr('class', 'remove')
      .attr('transform', function (d: any, i: number) {
        return 'translate(' + positions[i][0] + ', ' + positions[i][1] + ')';
      })
      .attr('r', function (d: any) {
        return nodeScale(d.count);
      })
      .style('fill', function (d: any) {
        return color(d.type);
      })
      .attr('fill-opacity', 1.0)
      .attr('fill', function (d: any) {
        return color(d.status);
      })
      .on('mouseover', (e: any, d: any) => fade(d, 0.2, false))
      .on('mouseout', (e: any, d: any) => fade(d, 1, true))
      .append('title')
      .text(function (d: any) {
        return (
          'Site: ' +
          d.site +
          '\nType: ' +
          d.type +
          '\n# Investigators: ' +
          d.count +
          '\n# Collaborating Sites: ' +
          collaborator_count(d)
        );
      });
  }
}
