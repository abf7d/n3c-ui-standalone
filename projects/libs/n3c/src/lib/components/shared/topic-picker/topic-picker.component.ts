import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Output, Input, HostListener, ElementRef} from '@angular/core';
import {OptGroup, Option} from './topic-picker.interface';
import {FormsModule} from '@angular/forms';
import {FilterOptionsPipe} from './filter-options.pipe';

@Component({
  imports: [CommonModule, FormsModule, FilterOptionsPipe],
  selector: 'app-topic-picker',
  templateUrl: './topic-picker.component.html',
  styleUrls: ['./topic-picker.component.scss']
})
export class TopicPickerComponent {
  @Input() options: OptGroup[] | Option[] = [];
  @Input() selectedValue: string = '';
  @Input() enableSearch = false;
  @Output() topicChanged = new EventEmitter<string>();

  searchTerm = '';
  dropdownOpen = false;

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.dropdownOpen && event.target && !this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(value: string) {
    this.selectedValue = value;
    this.topicChanged.emit(value);
    this.dropdownOpen = false;
    this.searchTerm = '';
  }

  getSelectedLabel(): string | undefined {
    const allOptions = this.flatOptions.length ? this.flatOptions : this.groupedOptions.flatMap((g) => g.options);
    return allOptions.find((o) => o.value === this.selectedValue)?.label;
  }

  get groupedOptions(): OptGroup[] {
    return Array.isArray(this.options) && this.options.length > 0 && 'options' in this.options[0]
      ? (this.options as OptGroup[])
      : [];
  }

  get flatOptions(): Option[] {
    return Array.isArray(this.options) && this.options.length > 0 && !('options' in this.options[0])
      ? (this.options as Option[])
      : [];
  }

  onTopicChange(newValue: string) {
    this.topicChanged.emit(newValue);
  }
}
