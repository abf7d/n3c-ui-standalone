import {Component, inject, OnInit, ElementRef, ViewEncapsulation} from '@angular/core';
import {select} from 'd3-selection';
import {scaleLinear, scaleBand, scaleOrdinal} from 'd3-scale';
import {stack} from 'd3-shape';
import {max} from 'd3-array';
import {ICellRendererParams} from 'ag-grid-community';

interface CustomCellRendererParams extends ICellRendererParams {
  bar1: string;
  bar2: string;
  max: string;
  colors: string[];
}

@Component({
  selector: 'app-bar-cell-renderer',
  templateUrl: './bar-cell-renderer.component.html',
  styleUrls: ['./bar-cell-renderer.component.scss'],
  encapsulation: ViewEncapsulation.None, // Use None to avoid Angular's default encapsulation
  standalone: false
})
export class BarCellRendererComponent implements OnInit {
  private params: CustomCellRendererParams | undefined;
  private value: any;
  private additionalData: any;

  private hostElement = inject(ElementRef);

  ngOnInit(): void {
    // Initial render, if value and additionalData are set at this time
    if (this.value && this.additionalData) {
      this.drawBarChart();
    }
  }

  agInit(params: CustomCellRendererParams): void {
    this.params = params;
    this.value = params.value;

    // Remove padding and margin from cell
    const cellElement = this.hostElement.nativeElement.closest('.ag-cell');
    if (cellElement) {
      cellElement.style.paddingLeft = '10px'; // Adjust padding to match the header
      cellElement.style.paddingRight = '10px';
      cellElement.style.margin = '0';
    }

    // Render with delay to ensure proper width calculation
    setTimeout(() => {
      this.drawBarChart();
    }, 100); // Add a delay here as well
  }

  private drawBarChart(): void {
    // ────────────────────────────────
    // CONSTANTS AND INPUTS
    // ────────────────────────────────
    const width = 1700;
    const marginTop = 0,
      marginRight = 0,
      marginBottom = 0,
      marginLeft = 0;

    const {data: dataPoint, bar1, bar2, max: maxKey, colors} = this.params!;

    if (!dataPoint) return;

    const val1 = +dataPoint[bar1];
    const val2 = +dataPoint[bar2];
    const valMax = +dataPoint[maxKey];

    if (isNaN(val1) || isNaN(val2) || isNaN(valMax)) return;

    // ────────────────────────────────
    // 1.  BUILD ONE ROW AS A MAP
    // ────────────────────────────────
    const keys = ['avg_in_ehr', 'Avg Medicare Enhancement', 'max_total_avg'] as const;

    const row = new Map<string, number>([
      [keys[0], val1],
      [keys[1], val2],
      [keys[2], valMax - val1 - val2]
    ]);

    // The stack generator expects an *array* of rows.
    const rows = [row];

    // ────────────────────────────────
    // 2.  STACK
    // ────────────────────────────────
    const series = stack<Map<string, number>, string>()
      .keys(keys)
      .value((r, k) => r.get(k) ?? 0)(rows);

    // ────────────────────────────────
    // 3.  SCALES
    // ────────────────────────────────
    const height = series[0].length * 25 + marginTop + marginBottom; // = 25 px
    const maxY = max(series, (s) => max(s, (d) => d[1]))!;

    const x = scaleLinear<number>()
      .domain([0, maxY])
      .range([marginLeft, width - marginRight]);

    // one stacked bar → one y-band
    const y = scaleBand<string>()
      .domain(['bar']) // single slot
      .range([marginTop, height - marginBottom])
      .padding(0.08);

    const color = scaleOrdinal<string>().domain(keys).range([colors[0], colors[1], 'none']).unknown('none');

    const total = val1 + val2;
    const bar1Prcnt = total > 0 ? (Math.round((val1 / total) * 10000) / 100).toFixed(2) : '0.00';
    const bar2Prcnt = (100 - Math.round(+bar1Prcnt * 100) / 100).toFixed(2);

    const element = this.hostElement.nativeElement.querySelector('.d3-container');
    select(element).selectAll('*').remove();

    const tooltip = select(element)
      .append<HTMLDivElement>('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('left', '0px')
      .style('top', '0px');

    select(element).style('position', 'relative');

    // Create the SVG container.
    const svg = select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', 45)
      .attr('viewBox', [0, 0, width, 40])
      .attr('style', 'height: 100%; margin-top: -5px;');
    const parent = this.hostElement.nativeElement;

    // Append a group for each series, and a rect for each element in the series.
    svg
      .append('g')
      .selectAll()
      .data(series)
      .join('g')
      .attr('fill', (d) => (color(d.key ?? 'black') as string) ?? 'black')
      .selectAll('rect')
      .data((D) => D.map((d) => (((d as any).key = D.key), d)))
      .join('rect')
      .attr('x', (d) => x(d[0]))
      .attr('y', (d: any) => y(d.data[0]) ?? 0)
      .attr('height', '60px')
      .attr('width', (d) => x(d[1]) - x(d[0]))
      .on('mouseover', function (event: MouseEvent, d) {
        select(this).attr('fill', 'orange');
        const xPos = x(d[0]);
        let finalX = xPos;
        let value;
        let prcnt;
        if (xPos === 0) {
          finalX = 7;
          value = dataPoint[bar1];
          prcnt = bar1Prcnt;
        } else {
          value = dataPoint[bar2];
          prcnt = bar2Prcnt;

          const rect = this as SVGGraphicsElement;
          const svg = rect.ownerSVGElement!;
          const wrapper = select(parent).node() as HTMLElement;

          /* ---- 1-a. create an SVGPoint at the centre-top of the rect ---- */
          const pt = svg.createSVGPoint();
          pt.x = +rect.getAttribute('x')! + +rect.getAttribute('width')! / 2;
          pt.y = +rect.getAttribute('y')!; // or top-centre-above

          /* ---- 1-b. project that point into the page coordinate system ---- */
          const screenPt = pt.matrixTransform(rect.getScreenCTM()!);

          /* ---- 1-c. translate to wrapper-relative pixels (for CSS) ---- */
          const wrapperBox = wrapper.getBoundingClientRect();
          finalX = screenPt.x - wrapperBox.left - 50;
          const yPx = screenPt.y - wrapperBox.top - 8;
        }

        if (finalX < 0) {
          finalX = 25;
        }
        tooltip
          .style('opacity', 1)
          .html(
            `<div class="tool-back"><strong>${value}</strong>
             (${prcnt}%)</div>`
          )
          .style('left', finalX + 'px')
          .style('top', '16px');
      })
      .on('mouseout', function () {
        select(this).attr('fill', null); // reset fill
        tooltip.style('opacity', 0);
      });
  }
}
