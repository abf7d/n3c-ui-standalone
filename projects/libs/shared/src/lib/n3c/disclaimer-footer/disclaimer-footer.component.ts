import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ExternalLinkComponent} from '../../external-link/external-link.component';

@Component({
  selector: 'app-disclaimer-footer',
  imports: [CommonModule, RouterModule, ExternalLinkComponent],
  templateUrl: './disclaimer-footer.component.html',
  styleUrl: './disclaimer-footer.component.scss'
})
export class DisclaimerFooterComponent {
  @Input() showCC!: boolean;
  @Input() noMargin!: boolean;
}
