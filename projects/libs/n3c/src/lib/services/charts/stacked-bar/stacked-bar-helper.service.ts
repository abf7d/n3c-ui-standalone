import {Injectable} from '@angular/core';
import {ChartGroup, ChartSegment} from './stacked-bar.interface';
import {sum} from 'd3-array';
import {toJpeg, toPng, toSvg} from 'html-to-image';
import {saveAs} from 'file-saver';

@Injectable()
export class StackedBarHelperService {
  formatValue(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(2).replace(/\.00$/, '') + 'k';
    return value.toString();
  }

  getLegendItems(data: ChartGroup[]) {
    const seen = new Set<string>();
    return data
      .flatMap((group) => group.segments)
      .filter((seg) => {
        if (seen.has(seg.label)) return false;
        seen.add(seg.label);
        return true;
      })
      .map((seg) => ({label: seg.label, color: seg.color}));
  }

  getTotal(group: ChartGroup): number {
    return sum(group.segments, (s) => s.value);
  }

  getTooltipHtml(segment: ChartSegment, group: ChartGroup): string {
    const total = this.getTotal(group);
    const percent = ((segment.value / total) * 100).toFixed(2);

    return `
    <div class="d-flex align-items-center mb-2">
      <i class="fas fa-circle me-2" style="color: ${segment.color}"></i>
      <strong>${segment.label}</strong>
    </div>
    <div><strong>Count:</strong> ${segment.value.toLocaleString()}</div>
    <div><strong>Percent:</strong> ${percent}%</div>
  `;
  }

  async exportAsImage(el: HTMLElement, format: string, filename: string): Promise<void> {
    const options = {quality: 1, backgroundColor: '#fff'};

    switch (format) {
      case 'jpg':
        return toJpeg(el, options).then((dataUrl) => saveAs(dataUrl, `${filename}.jpg`));
      case 'png':
        return toPng(el, options).then((dataUrl) => saveAs(dataUrl, `${filename}.png`));
      case 'svg':
        return toSvg(el).then((dataUrl) => saveAs(dataUrl, `${filename}.svg`));
      default:
        return Promise.reject(
          new Error('Unsupported export format: ' + format + '. Supported formats are: jpg, png, svg')
        );
    }
  }

  getTextColorForBackground(bgColor: string): string {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000' : '#fff';
  }
}
