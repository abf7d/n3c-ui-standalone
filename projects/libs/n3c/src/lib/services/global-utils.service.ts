import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalUtilsService {
  formatLargeNumber(value: number, sigFigs: number = 3): string {
    if (value === null || value === undefined) return '';
    let scaled = value;
    if (value >= 1_000_000_000) {
      scaled = value / 1_000_000_000; // billions
    } else if (value >= 1_000_000) {
      scaled = value / 1_000_000; // millions
    }
    return scaled.toPrecision(sigFigs);
  }
}
