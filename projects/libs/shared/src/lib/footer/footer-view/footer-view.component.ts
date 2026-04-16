import {Component, OnInit, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExternalLinkComponent} from '../../external-link/external-link.component';

@Component({
  selector: 'app-footer-view',
  templateUrl: './footer-view.component.html',
  styleUrls: ['./footer-view.component.scss'],
  standalone: true,
  imports: [CommonModule, ExternalLinkComponent]
})
export class FooterViewComponent {
  @Input() showCC!: boolean;
  @Input() noMargin!: boolean;
}
