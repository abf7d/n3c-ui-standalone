import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-n3c-loader',
  templateUrl: './loader.component.html',
  imports: [],
  styleUrls: ['./loader.component.scss']
})
export class N3cLoaderComponent {
  @Input() showText = true;
  @Input() loading = false;
  @Input() showError = false;
}
