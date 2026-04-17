import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {scaleOrdinal} from 'd3-scale';

@Injectable()
export class ContributingSitesService {
  private http = inject(HttpClient);

  draw(svg: any, projection: any, contrib_data: any) {
    if (contrib_data == null || svg == null) return;

    const contrib_g = svg.append('g').attr('class', 'layer'); // we need to class this for zooming by the vase code

    var color = scaleOrdinal<string>()
      .domain(['available', 'submitted', 'pending'])
      .range(['#007bff', '#8406D1', '#8406D1']);

    const locationBySite: any[] = [];
    const positions: any[] = [];

    var sites = contrib_data.sites.filter(function (site: any) {
      var location = [site.longitude, site.latitude];
      if (projection(location) == 'undefined') return false;
      locationBySite[site.id] = projection(location);
      positions.push(projection(location));
      return true;
    });

    contrib_g
      .selectAll('circle')
      .data(sites)
      .enter()
      .append('svg:circle')
      .attr('class', 'remove')
      .attr('transform', function (d: any, i: any) {
        return 'translate(' + positions[i][0] + ', ' + positions[i][1] + ')';
      })
      .attr('r', function (d: any) {
        return 7;
      })
      .attr('fill-opacity', 1.0)
      .attr('fill', function (d: any) {
        return color(d.status);
      })
      .append('title')
      .html(function (d: any) {
        return (
          "<b>Site:</b> <a href='" +
          d.url +
          "'>" +
          d.site +
          '</a><br><b>Type:</b> ' +
          d.type +
          '<br><b>Status:</b> ' +
          d.status
        );
      });
  }
}
