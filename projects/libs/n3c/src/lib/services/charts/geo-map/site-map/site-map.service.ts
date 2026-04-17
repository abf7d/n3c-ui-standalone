import {inject, Injectable} from '@angular/core';
import {select, selectAll, pointer} from 'd3-selection';
import type {Selection} from 'd3-selection';
import {scaleOrdinal, scaleLinear, scaleThreshold} from 'd3-scale';
import type {ScaleOrdinal, ScaleLinear, ScaleThreshold} from 'd3-scale';
import {geoNaturalEarth1, geoPath} from 'd3-geo';
import {symbol, symbolDiamond, symbolCircle} from 'd3-shape';
import {zoom, zoomIdentity} from 'd3-zoom';
import {max} from 'd3-array';
import 'd3-transition';
import {
  AlbersUSATerritoriesProjection,
  AlbersUSATerritoriesProjectionService
} from '../base-geo-map/albers-usa-territories-projection';
import {MapData, StateInfo, SiteLocations, Site} from '../../../../models/admin-models';
import {MapColors} from '@odp/n3c/lib/components/dashboards/contributing-sites/contributing-sites.component';

@Injectable()
export class SitemapChartService {
  projection: any;
  private isLargeMap = false;
  private symbolSizeMult = 1;
  private mapColors: MapColors | null = null;
  private useSymbols = true;

  private width!: number;
  private height!: number;
  private margin = {top: 0, right: 10, bottom: 10, left: 110};
  path: any;
  zoom: any;
  svg: any;
  gEl: any;
  color: any;
  stroke: any;
  private tooltip: any;

  private albersUsaTerrProjService = inject(AlbersUSATerritoriesProjectionService);

  init(symbolSizeMult: number, useSymbols: boolean, mapColors: MapColors, isLargeMap: boolean) {
    this.symbolSizeMult = symbolSizeMult;
    this.useSymbols = useSymbols;
    this.mapColors = mapColors;
    this.isLargeMap = isLargeMap;
  }
  draw(mapData: MapData, usStates: StateInfo, ochinLocations: SiteLocations, siteLocations: SiteLocations, el: any) {
    if (!this.isLargeMap) {
      this.margin.top = 60;
    } else {
      this.margin.top = -40;
    }
    this.width = 1060;
    this.height = 600;
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
        .translate([width / 2 - this.margin.left, height / 2 + this.margin.top]) as AlbersUSATerritoriesProjection
    ) // translate to center of screen
      .scale(width); // scale things down so see entire US

    // Define path generator
    this.path = geoPath() // path generator that will convert GeoJSON to SVG paths
      .projection(this.projection); // tell path generator to use albersUsa projection

    this.tooltip = select(el)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('background-color', '#fff')
      .style('border', '1px solid #ccc')
      .style('border-radius', '5px')
      .style('padding', '10px')
      .style('pointer-events', 'none'); // Create a tooltip div

    let yRatio = 690;
    if (this.isLargeMap) yRatio = 590;
    this.svg = select(el)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 960 ${yRatio}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');

    // Color Scale For Legend and Map
    let color: ScaleOrdinal<string, unknown, never>;
    if (!this.isLargeMap) {
      color = scaleOrdinal<string>()
        .domain(['available', 'submitted', 'pending'])
        .range(['rgb(51, 40, 141)', 'rgb(84, 84, 84)', 'rgb(84, 84, 84)']);
    } else {
      color = scaleOrdinal<string>()
        .domain(['available', 'submitted', 'pending'])
        .range([this.mapColors!.available, this.mapColors!.available, this.mapColors!.pending]);
    }

    this.color = color;
    let stroke = scaleOrdinal().domain(['available', 'submitted', 'pending']).range(['#fff', '#6b486b', '#6b486b']);
    this.stroke = stroke;
    let dataArray = [];
    let states = mapData.states;
    for (let d = 0; d < states.length; d++) {
      dataArray.push(parseFloat(states[d].count + ''));
    }
    // Loop through each state data value in the json array
    for (let i = 0; i < states.length; i++) {
      let dataState = states[i].name;
      let dataValue = states[i].count;
      let dataRegion = states[i].region;
      // Find the corresponding state inside the GeoJSON
      for (let j = 0; j < usStates.features.length; j++) {
        let jsonState = usStates.features[j].properties.name;
        if (dataState == jsonState) {
          // Copy the data value into the JSON
          usStates.features[j].properties.value = dataValue;
          usStates.features[j].properties.color = dataRegion;
          break;
        }
      }
    }
    this.gEl = this.svg.append('g').classed('container', true);
    const statesG = this.gEl.append('g').classed('states', true);
    // Bind the data to the SVG and create one path per GeoJSON feature
    statesG
      .selectAll('path')
      .data(usStates.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('name', (d: any) => d.properties.name)
      .attr('class', 'base');

    // Add ochin locations
    let locationBySite = [];
    let positions: any[] = [];

    let oSites = ochinLocations.sites.filter((site: any) => {
      let location = [site.longitude, site.latitude];
      locationBySite[site.id] = this.projection(location);
      positions.push(this.projection(location));
      return true;
    });
    const gElSymbols = this.gEl.append('g');

    gElSymbols.classed('symbols', true);
    gElSymbols
      .selectAll('path')
      .data(oSites)
      .enter()
      .append('path')
      .attr('d', (d: any) => {
        if (this.useSymbols) {
          return symbol()
            .type(symbolDiamond)
            .size(60 * this.symbolSizeMult)();
        }
        return symbol(symbolCircle).size(30 * this.symbolSizeMult)();
      })
      .attr('transform', function (d: any, i: number) {
        return 'translate(' + positions[i][0] + ', ' + positions[i][1] + ')';
      })
      .attr('stroke', (d: any) => {
        if (this.isLargeMap) {
          return 'none';
        }
        return stroke('No');
      })
      .attr('fill', (d: any) => {
        if (this.mapColors) {
          return this.mapColors.ochin;
        }
        return color('No');
      });

    const positionsSL: any[] = [];

    let sites = siteLocations.sites.filter((site: any) => {
      let location = [site.longitude, site.latitude];
      locationBySite[site.id] = this.projection(location);
      positionsSL.push(this.projection(location));
      return true;
    });

    const gCircles = this.gEl.append('g');
    gCircles.classed('circles', true);
    // Circles for site locations

    const circles = gCircles
      .selectAll('circle')
      .data(sites)
      .enter()
      .append('svg:circle')
      .style('stroke', (d: any) => {
        if (this.isLargeMap) return 'none';
        return stroke(d.status);
      })
      .style('stroke-width', '1')
      .style('fill', (d: any) => {
        return color(d.status);
      })
      .style('fill-opacity', 0.5)
      .attr('cx', (d: any, i: number) => {
        return positionsSL[i][0];
      })
      .attr('cy', (d: any, i: number) => {
        return positionsSL[i][1];
      })
      .attr('r', (d: any, i: number) => {
        return 7 * this.symbolSizeMult;
      });

    circles
      .on('mouseover', (event: any, d: any) => {
        this.tooltip.style('opacity', 0.8);
        const tip = `<div>Site: ${d.site}</div>
                       <div>Type: ${d.type}</div>
                       <div>Status: ${d.status}</div>`;

        if (!this.isLargeMap) {
          const pos = pointer(event, gCircles.node());
          this.tooltip
            .html(tip)
            .style('position', 'absolute')
            .style('left', event.offsetX + 'px')
            .style('top', event.offsetY + 10 + 'px');
        } else {
          this.tooltip
            .html(tip)
            .style('position', 'absolute')
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 10 + 'px');
        }
      })
      .on('mouseover.fade', (e: any, d: any) => fade(d, 0.1))
      .on('mouseout.tooltip', (e: any, d: any) => {
        this.tooltip.style('opacity', 0);
      })
      .on('mouseout.fade', (e: any, d: any) => fade(d, 0.5));

    function fade(d: any, opacity: number) {
      circles.style('fill-opacity', (o: any) => {
        return o === d ? 0.5 : opacity; // Keep the hovered circle fully opaque
      });
    }

    return {svg: this.svg, projection: this.projection};
  }

  drawCircles(sites: Site[], mapColors: MapColors) {
    if (!this.gEl) return;
    this.gEl.select('g.circles').remove();

    const gCircles = this.gEl.append('g');
    gCircles.classed('circles', true);
    // Circles for site locations

    const positionsSL: any[] = [];

    sites.filter((site: any) => {
      let location = [site.longitude, site.latitude];
      positionsSL.push(this.projection(location));
      return true;
    });

    const circles = gCircles
      .selectAll('circle')
      .data(sites)
      .enter()
      .append('svg:circle')
      .style('stroke', (d: any) => {
        if (mapColors) return 'none';
        return this.stroke(d.status);
      })
      .style('stroke-width', '1')
      .style('fill', (d: any) => {
        return this.color(d.status);
      })
      .style('fill-opacity', 0.5)
      .attr('cx', (d: any, i: number) => {
        return positionsSL[i][0];
      })
      .attr('cy', (d: any, i: number) => {
        return positionsSL[i][1];
      })
      .attr('r', (d: any, i: number) => {
        return 7 * 0.6;
      });

    circles
      .on('mouseover.tooltip', (event: any, d: any) => {
        this.tooltip.style('opacity', 0.8);
        const tip = `<div>Site: ${d.site}</div>
                       <div>Type: ${d.type}</div>
                       <div>Status: ${d.status}</div>`;

        const pos = pointer(event, this.gEl.node());
        this.tooltip
          .html(tip)
          .style('position', 'absolute')
          .style('left', event.pageX + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseover.fade', (e: any, d: any) => fade(d, 0.1))
      .on('mouseout.tooltip', (e: any, d: any) => {
        this.tooltip.style('opacity', 0);
      })
      .on('mouseout.fade', (e: any, d: any) => fade(d, 0.5));

    function fade(d: any, opacity: number) {
      circles.style('fill-opacity', (o: any) => {
        return o === d ? 0.5 : opacity; // Keep the hovered circle fully opaque
      });
    }
  }
  drawAdminLegend() {
    const gLegend = this.gEl.append('g');
    gLegend.classed('legend', true);
    // Legend
    gLegend
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 25)
      .style('opacity', 0.5)
      .attr('r', 7 * this.symbolSizeMult)
      .style('stroke', this.stroke('available'))
      .style('fill', this.color('available'));
    gLegend
      .append('circle')
      .attr('cx', 10)
      .attr('cy', 50)
      .style('opacity', 0.5)
      .attr('r', 7 * this.symbolSizeMult)
      .style('stroke', this.stroke('pending'))
      .style('fill', this.color('pending'));
    gLegend
      .append('path')
      .attr('d', (d: any) => {
        return symbol().type(symbolDiamond).size(60)();
      })
      .attr('transform', (d: any, index: number) => {
        return 'translate(10, 75)';
      })
      .attr('stroke', this.stroke('No'))
      .attr('fill', this.color('No'));
    gLegend
      .append('text')
      .attr('x', 20)
      .attr('y', 25)
      .text('Data Available')
      .style('font-size', '20px')
      .attr('alignment-baseline', 'middle');
    gLegend
      .append('text')
      .attr('x', 20)
      .attr('y', 50)
      .text('Data transfer signed, pending availability')
      .style('font-size', '20px')
      .attr('alignment-baseline', 'middle');
    gLegend
      .append('text')
      .attr('x', 20)
      .attr('y', 75)
      .text('OCHIN contributing site')
      .style('font-size', '20px')
      .attr('alignment-baseline', 'middle');
  }

  drawContributingLegend(
    data: any,
    colorLegendEl: any,
    siteLegendEl: any,
    type: 'population' | 'birthrate' | 'deathrate',
    mapColors: MapColors | null = null
  ) {
    select(colorLegendEl).selectAll('*').remove();
    const nodeValue = (d: any) => {
      switch (type) {
        case 'population':
          return d.popestimate2023;
        case 'birthrate':
          return d.rbirth2023;
        case 'deathrate':
          return d.rdeath2023;
        default:
          return 0;
      }
    };
    const max = Math.max(...data.map((x: any) => nodeValue(x)));
    const legendEntries = this.buildLegend(max);
    const siteLegend = select(colorLegendEl)
      .append('div')
      .attr('class', 'site-legend')
      .selectAll('div')
      .data(legendEntries)
      .enter()
      .append('div')
      .classed('entry', true);

    siteLegend
      .append('div')
      .classed('l-color', true)
      .classed('missing', (d) => d.name === 'Missing')
      .style('background-color', (d: any) => d.color);

    siteLegend
      .append('div')
      .classed('name', true)
      .text((d) => d.name);

    this.drawSymbols(siteLegendEl, mapColors);
  }

  drawSymbols(siteLegendEl: any, mapColors: MapColors | null = null) {
    select(siteLegendEl).selectAll('*').remove();
    const siteLegend = select(siteLegendEl).append('div').attr('class', 'symbol-legend');

    const availDiv = siteLegend.append('div').classed('symbol-entry', true);
    availDiv
      .append('svg')
      .classed('symbol-el', true)
      .append('circle')
      .style('stroke', (d: any) => {
        return this.stroke('available');
      })
      .style('stroke-width', '1')
      .style('fill', (d: any) => {
        return this.color('available');
      })
      .style('fill-opacity', (d) => {
        if (mapColors) {
          return 1;
        }
        return 0.5;
      })
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', (d: any, i: number) => {
        return 7;
      });

    availDiv.append('div').text('Data Available');

    const pendingDiv = siteLegend.append('div').classed('symbol-entry', true);
    pendingDiv
      .append('svg')
      .classed('symbol-el', true)
      .append('circle')
      .style('stroke', (d: any) => {
        return this.stroke('pending');
      })
      .style('stroke-width', '1')
      .style('fill', (d: any) => {
        return this.color('pending');
      })
      .style('fill-opacity', 0.5)
      .attr('cx', 10)
      .attr('cy', 10)
      .attr('r', (d: any, i: number) => {
        return 7;
      });
    pendingDiv.append('div').text('Data Transfer Signed: Pending Availability');

    const pathDiv = siteLegend.append('div').classed('symbol-entry', true);
    pathDiv
      .append('svg')
      .classed('symbol-el', true)
      .append('path')
      .attr('d', function (d: any) {
        return symbol(symbolCircle).size(() => {
          if (mapColors) {
            return 60;
          }
          return 30 * 1;
        })();
      })
      .attr('stroke', (d: any) => {
        if (mapColors) {
          return 'none';
        }
        return this.stroke('No');
      })
      .attr('fill', (d: any) => {
        if (mapColors) {
          return mapColors.ochin;
        }
        return this.color('No');
      })
      .attr('transform', (d: any, index: number) => {
        return 'translate(10, 10)';
      });
    pathDiv.append('div').text('OCHIN Contributing Site');
  }

  buildLegend(max: number, buckets = 5): LegendEntry[] {
    const formatter = new Intl.NumberFormat('en-US'); // 1,000‑style commas
    const step = Math.ceil(max / buckets); // size of each bucket
    const legend: LegendEntry[] = [{name: 'Missing', range: null, color: 'white'}];

    let lower = 0;
    for (let i = 0; i < buckets; i++) {
      const upper = i === buckets - 1 ? max : lower + step - 1;
      legend.push({
        name: `${formatter.format(lower)} - ${formatter.format(upper)}`,
        range: [lower, upper],
        color: this.county_colorScale(lower)
      });
      lower = upper + 1; // next bucket starts after current upper
    }

    return legend;
  }
  county_colorScale!: ScaleThreshold<number, string, never> | ScaleLinear<string, string, never>;

  drawCounties(
    countyLevelData: any[],
    mapCounties: {features: any[]},
    selectedCountyDataType: 'population' | 'birthrate' | 'deathrate' = 'population',
    colorScaleType: 'threshold' | 'linear' = 'threshold',
    colorRange: string[] = ['#e2e2e2', '#afafaf', '#7f7f7f', '#525252', '#292929']
  ) {
    if (mapCounties === null || countyLevelData === null || this.svg === null) {
      return;
    }
    this.gEl.select('g.counties').remove();
    const county_g = this.gEl.insert('g', ':first-child').attr('class', 'counties');
    const siteByCounty = new Map<string, any>(countyLevelData.map((x) => [x.code + '|' + x.county, x]));
    const nodeValue = (d: any) => {
      switch (selectedCountyDataType) {
        case 'population':
          return d.popestimate2023;
        case 'birthrate':
          return d.rbirth2023;
        case 'deathrate':
          return d.rdeath2023;
        default:
          return 0;
      }
    };

    const maxValue = max(countyLevelData, (d) => nodeValue(d)) ?? 0;

    if (colorScaleType === 'linear') {
      this.county_colorScale = scaleLinear<string, string>().domain([0, maxValue]).range(colorRange);
    } else {
      // threshold version (default)
      const step1 = Math.round(maxValue * 0.2);
      const step2 = Math.round(maxValue * 0.4);
      const step3 = Math.round(maxValue * 0.6);
      const step4 = Math.round(maxValue * 0.8);

      this.county_colorScale = scaleThreshold<number, string>().domain([step1, step2, step3, step4]).range(colorRange);
    }

    county_g
      .selectAll('.county')
      .data(mapCounties.features)
      .enter()
      .append('path')
      .attr('fill', (d: any) => {
        if (siteByCounty.get(d.properties.STATE + '|' + d.properties.COUNTY) === undefined) return 'none';
        else return this.county_colorScale(nodeValue(siteByCounty.get(d.properties.STATE + '|' + d.properties.COUNTY)));
      })
      .attr('d', this.path)
      .attr('class', 'county')
      .on('mousemove', (event: any, d: any) => {
        let site = siteByCounty.get(d.properties.STATE + '|' + d.properties.COUNTY);

        //Tooltip
        if (site === undefined) {
          return;
        } else {
          this.tooltip
            .style('opacity', 0.8)
            .style('left', event.pageX + 5 + 'px')
            .style('top', event.pageY - 28 + 'px')
            .html(
              `<b>${site.countyname} ${site.statename}</b><br>
               <b>Population</b>: ${site.popestimate2023.toLocaleString()}<br>
               <b>Birth Rate</b>: ${site.rbirth2023.toLocaleString()}<br>
               <b>Death Rate</b>: ${site.rdeath2023.toLocaleString()}`
            );
        }
      })
      .on('mouseleave', () => this.tooltip.style('opacity', 0))
      .on('click', (e: any, d: any) => this.clicked(d, this.path));

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
        this.svg.selectAll('.container').attr('transform', transform); // each layer has it's own "g"
      });

    this.svg.call(this.zoom);
  }
  private active: any;
  private clicked(d: any, path: any) {
    this.active = d;

    let bounds = path.bounds(d),
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

export interface LegendEntries {
  [key: string]: {name: string; range: [number, number] | null}[];
}

type LegendEntry =
  | {name: 'Missing'; range: null; color: string}
  | {name: string; range: [number, number]; color: string};
