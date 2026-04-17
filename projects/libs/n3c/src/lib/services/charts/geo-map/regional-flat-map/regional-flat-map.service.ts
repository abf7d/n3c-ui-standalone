import {Injectable} from '@angular/core';
import * as topojson from 'topojson-client';
import {select, selectAll} from 'd3-selection';
import type {Selection} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import type {ScaleLinear} from 'd3-scale';
import {geoAlbersUsa, geoPath} from 'd3-geo';
import {axisRight} from 'd3-axis';
import {range} from 'd3-array';
import {FeatureCollection, Geometry} from 'geojson';

@Injectable()
export class RegionalFlatMapService {
  /**
   * REGIONAL FLAT MAP SERVICE
   * This service consider the following data points (required for map and region):
   *  - https://covid.cd2h.org/dashboard/new_ph/severity_region/feeds/regions.jsp
   *  - https://covid.cd2h.org/dashboard/new_ph/severity_region/states.js
   *
   *  Legacy Page: https://covid.cd2h.org/dashboard/public-health/severity-region/map1
   */

  private aspectRatio = 0.582;
  private margin = {top: 10, right: 10, bottom: 10, left: 10};
  private projection: any;
  private path: any;
  private regionalProjection: any;
  private regionalPath: any;

  /**
   * Draw the map in the specified element
   * @param el
   * @param states
   * @param regions
   * @returns
   */

  draw(el: HTMLElement, states: any, regions: any[], colors?: string[]) {
    const container = select(el);
    if (container.empty()) {
      console.error(`Container with selector '${el}' not found.`);
      return;
    }

    const {width, height} = this.getContainerDimensions(container);
    this.initializeProjections();

    container.select('svg').remove();

    const svg = this.createSvg(container, width, height);
    const statesGroup = svg.append('g').attr('class', 'states');

    const feature = topojson.feature(states, states.objects.states_20m_2017) as unknown as FeatureCollection<Geometry>;
    this.fitProjection([width, height], feature, this.projection);
    this.fitProjection([width, height], feature, this.regionalProjection);

    this.drawStates(statesGroup, feature);

    const {regionsFiltered, minCount, maxCount} = this.processRegions(regions);

    const colorScale = this.createColorScale(minCount, maxCount, colors);
    this.drawLegend(svg, width, minCount, maxCount, colorScale);

    const regionsGroup = svg.append('g').attr('class', 'regions');
    this.drawRegions(regionsGroup, states, regionsFiltered, colorScale, el);

    this.drawRegionText(regionsGroup, states, regionsFiltered);
  }

  /**
   * Helper Functions
   */

  private getContainerDimensions(container: Selection<HTMLElement, unknown, null, undefined>) {
    const width = container.node()?.getBoundingClientRect().width ?? 0;
    const height = Math.max(width * this.aspectRatio, 300);
    return {width, height};
  }

  private initializeProjections() {
    this.projection = geoAlbersUsa();
    this.path = geoPath().projection(this.projection);

    this.regionalProjection = geoAlbersUsa();
    this.regionalPath = geoPath().projection(this.regionalProjection);
  }

  private createSvg(container: Selection<HTMLElement, unknown, null, undefined>, width: number, height: number) {
    return container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet');
  }

  private fitProjection(containerSize: [number, number], object: any, projection: any) {
    const [containerWidth, containerHeight] = containerSize;
    projection.scale(1).translate([0, 0]);
    const bounds = geoPath(projection).bounds(object);
    const scale = Math.min(
      containerWidth / (bounds[1][0] - bounds[0][0]),
      containerHeight / (bounds[1][1] - bounds[0][1])
    );
    const translate: [number, number] = [
      (containerWidth - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (containerHeight - scale * (bounds[1][1] + bounds[0][1])) / 2
    ];
    projection.scale(scale).translate(translate);
  }

  private drawStates(group: Selection<SVGGElement, unknown, null, undefined>, feature: FeatureCollection<Geometry>) {
    group.selectAll('.state').data(feature.features).enter().append('path').attr('class', 'state').attr('d', this.path);
  }

  private processRegions(regions: any[]) {
    const regionsFiltered = regions.reduce((acc: any[], region: any) => {
      region.rows.forEach((row: any) => {
        let match = acc.find((r) => r.name === row.region);
        if (!match) {
          match = {
            name: row.region,
            count: 0,
            site_count: 0,
            contains: this.getRegionStates(row.region)
          };
          acc.push(match);
        }
        match.count += row.patient_count;
        match.site_count += row.region_seq;
      });
      return acc;
    }, []);

    const counts = regionsFiltered.map((r) => r.count);
    return {
      regionsFiltered,
      minCount: Math.min(...counts),
      maxCount: Math.max(...counts)
    };
  }

  private createColorScale(min: number, max: number, colors?: string[]) {
    return scaleLinear<string>()
      .domain([min, (min + max) / 4, (min + max) / 2, (3 * max) / 4, max])
      .range(colors ? colors : ['#e4e4ff', '#bab7ef', '#938bdd', '#6e5fc8', '#4833b2']);
  }

  private drawLegend(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    width: number,
    minCount: number,
    maxCount: number,
    colorScale: ScaleLinear<string, string>
  ) {
    const legendWidth = 20;
    const legendHeight = 150;
    const legend = svg.append('g').attr('transform', `translate(${width + 20}, 50)`);

    // Create gradient
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'colorGradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').style('stop-color', '#4833b2');
    gradient.append('stop').attr('offset', '100%').style('stop-color', '#e4e4ff');

    // Add gradient rectangle
    legend.append('rect').attr('width', legendWidth).attr('height', legendHeight).style('fill', 'url(#colorGradient)');

    // Add scale and ticks
    const legendTicks = range(minCount, maxCount, (maxCount - minCount) / 5).concat(maxCount);
    const legendScale = scaleLinear().domain([minCount, maxCount]).range([legendHeight, 0]);
    const legendAxis = axisRight(legendScale)
      .tickValues(legendTicks) // Use explicit tick values
      .tickFormat((d) => d.toLocaleString()); // Format tick values with commas

    legend.append('g').attr('transform', `translate(${legendWidth}, 0)`).call(legendAxis);

    // Add legend title
    legend.append('text').attr('x', -10).attr('y', -10).style('font-size', '12px').text('Total Patients');
  }

  private drawRegions(
    group: Selection<SVGGElement, unknown, null, undefined>,
    states: any,
    regionsFiltered: any[],
    colorScale: ScaleLinear<string, string>,
    el: HTMLElement
  ) {
    group
      .selectAll('.region')
      .data(regionsFiltered)
      .enter()
      .append('path')
      .attr('class', 'region')
      .attr('d', (region: any) => {
        const mergedFeatures = topojson.merge(
          states,
          states.objects.states_20m_2017.geometries.filter((state: any) =>
            region.contains.includes(state.properties.STUSPS)
          )
        );
        return this.regionalPath(mergedFeatures);
      })
      .attr('fill', (d: any) => colorScale(d.count))
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .on('mousemove', (event: MouseEvent, d: any) => this.showTooltip(event, d))
      .on('mouseout', () => selectAll('.tooltip').remove())
      .on('click', (event: MouseEvent, d: any) => this.handleRegionClick(event, d, el));
  }

  private drawRegionText(group: Selection<SVGGElement, unknown, null, undefined>, states: any, regionsFiltered: any[]) {
    group
      .selectAll('.region_text')
      .data(regionsFiltered)
      .enter()
      .append('text')
      .attr('class', 'region_text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('x', (d: any) => this.getRegionCentroid(d, states)[0])
      .attr('y', (d: any) => this.getRegionCentroid(d, states)[1])
      .text((d: any) => d.name);
  }

  private getRegionCentroid(region: any, states: any) {
    const mergedFeature = topojson.merge(
      states,
      states.objects.states_20m_2017.geometries.filter((state: any) =>
        region.contains.includes(state.properties.STUSPS)
      )
    );
    return this.regionalPath.centroid(mergedFeature);
  }

  private getRegionStates(regionName: string): string[] {
    const regionsMap: Record<string, string[]> = {
      'East North Central': ['WI', 'MI', 'IL', 'IN', 'OH'],
      'East South Central': ['KY', 'TN', 'MS', 'AL'],
      'Middle Atlantic': ['NY', 'PA', 'NJ'],
      Mountain: ['MT', 'ID', 'WY', 'NV', 'UT', 'CO', 'AZ', 'NM'],
      'New England': ['ME', 'NH', 'VT', 'MA', 'CT', 'RI'],
      Pacific: ['WA', 'OR', 'CA', 'AK', 'HI'],
      'South Atlantic': ['WV', 'MD', 'DE', 'DC', 'VA', 'NC', 'SC', 'GA', 'FL'],
      'West North Central': ['ND', 'SD', 'MN', 'NE', 'IA', 'KS', 'MO'],
      'West South Central': ['OK', 'AR', 'TX', 'LA']
    };
    return regionsMap[regionName] || [];
  }

  private showTooltip(event: MouseEvent, data: any) {
    selectAll('.tooltip').remove();
    select('body')
      .append('div')
      .attr('class', 'region tooltip')
      .style('left', `${event.pageX + 5}px`)
      .style('top', `${event.pageY - 28}px`).html(`
        <strong>Region:</strong> ${data.name}<br/>
        <strong>Total:</strong> ${data.count.toLocaleString()}<br/>
        <strong># Providers:</strong> ${data.site_count}<br/>
        <strong>Contains:</strong> ${data.contains.join(', ')}
      `);
  }

  private handleRegionClick(event: MouseEvent, data: any, el: HTMLElement) {
    const handlerName = `${el.id.replace(/_[^_]+_[^_]+$/i, '_').replace('#', '')}viz_constrain`;
    if (typeof (window as any)[handlerName] === 'function') {
      (window as any)[handlerName]({secondary_name: data.name, secondary: data.name}, 'region');
    }
  }
}
