import {Pipe, PipeTransform} from '@angular/core';
import {Option} from './topic-picker.interface';

@Pipe({name: 'filterOptions'})
export class FilterOptionsPipe implements PipeTransform {
  transform(options: Option[], search: string = ''): Option[] {
    if (!options || !search) return options;
    const lower = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }
}
