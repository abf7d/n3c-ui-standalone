import {Component, Input, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.scss'],
  imports: [],
  encapsulation: ViewEncapsulation.None
})
export class ExternalLinkComponent {
  @Input() url?: string;
  @Input() text?: string;
  @ViewChild('extDialog') dialog!: ElementRef<HTMLDialogElement>;

  isGov() {
    return !!this.url?.includes('.gov');
  }

  open() {
    if (this.url?.includes('.gov')) {
      window.open(this.url, '_blank');
      return;
    }
    this.dialog.nativeElement.showModal();
  }

  closeDialog() {
    this.dialog.nativeElement.close();
  }

  processToURL() {
    window.open(this.url, '_blank');
    this.dialog.nativeElement.close();
  }
}
