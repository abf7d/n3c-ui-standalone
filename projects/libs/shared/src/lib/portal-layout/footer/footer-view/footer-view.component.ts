import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-portal-footer-view',
  templateUrl: './footer-view.component.html',
  styleUrls: ['./footer-view.component.scss'],
  standalone: false
})
export class PortalFooterViewComponent {
  @Input() showCC!: boolean;
  @Input() noMargin!: boolean;
}
