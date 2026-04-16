import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'longCompactNumber',
  standalone: true
})
export class LongCompactNumberPipe implements PipeTransform {
  transform(value: number, fractionDigits: number = 1): string {
    if (value === null || value === undefined) return '';

    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(fractionDigits) + ' billion';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(fractionDigits) + ' million';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(fractionDigits) + ' thousand';
    }
    return value.toString();
  }
}
