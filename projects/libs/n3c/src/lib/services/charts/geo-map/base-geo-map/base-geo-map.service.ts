import {inject, Injectable} from '@angular/core';
import {select} from 'd3-selection';
import {geoNaturalEarth1, geoPath} from 'd3-geo';
import {zoom, zoomIdentity} from 'd3-zoom';
import 'd3-transition';
import {
  AlbersUSATerritoriesProjection,
  AlbersUSATerritoriesProjectionService
} from './albers-usa-territories-projection';

@Injectable()
export class BaseGeoMapService {
  projection: any;

  private width!: number;
  private height!: number;
  private margin = {top: 10, right: 10, bottom: 10, left: 10};
  path: any;
  zoom: any;
  svg: any;

  private albersUsaTerrProjService = inject(AlbersUSATerritoriesProjectionService);

  draw(regions: any, el: any): GeoMap {
    this.width = 1500;
    this.height = 815;
    this.margin = {top: 20, right: 100, bottom: 140, left: 40};
    const width = this.width;
    const height = this.height;

    this.projection = geoNaturalEarth1()
      .translate([width / 2, height / 2]) // translate to center of screen
      .rotate([100, -20])
      .scale(width / 2 / Math.PI); // scale things down so see entire US

    // Hard code the projection for now
    this.projection = (
      this.albersUsaTerrProjService
        .geoAlbersUsaTerritories()
        .translate([width / 2, height / 2]) as AlbersUSATerritoriesProjection
    ) // translate to center of screen
      .scale(width); // scale things down so see entire US

    // Define path generator
    this.path = geoPath() // path generator that will convert GeoJSON to SVG paths
      .projection(this.projection); // tell path generator to use albersUsa projection

    this.svg = select(el)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 1400 800')
      .attr('preserveAspectRatio', 'xMinYMin meet');

    var g = this.svg.append('g').attr('class', 'layer'); // base counts as a layer

    const extent: [[number, number], [number, number]] = [
      [this.margin.left, this.margin.top],
      [this.width - this.margin.right, this.height - this.margin.top]
    ];

    this.zoom = zoom()
      .scaleExtent([1, 50])
      .translateExtent(extent)
      .extent(extent)
      .on('zoom', (event: any) => {
        const {transform} = event;
        this.svg.selectAll('.layer').attr('transform', transform); // each layer has it's own "g"
      });

    this.svg.call(this.zoom);

    // Bind the data to the SVG and create one path per GeoJSON feature
    g.selectAll('.base')
      .data(regions.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('class', 'base')
      .on('click', (e: any, d: any) => this.clicked(d, this.path));

    return {svg: this.svg, projection: this.projection};
  }

  private active: any;
  private clicked(d: any, path: any) {
    this.active = d;

    var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / this.width, dy / this.height))),
      translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];

    this.svg
      .transition()
      .duration(1000)
      .call(this.zoom.transform, zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  }

  public resetZoom() {
    this.active = null;
    this.svg.transition().duration(750).call(this.zoom.transform, zoomIdentity);
  }
}

export interface GeoMap {
  svg: any;
  projection: any;
}
