import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';

@Component({
  selector: 'app-pprl-dashboard',
  imports: [RouterModule, MatIconModule, FormsModule, DashboardFooterComponent, HeaderViewComponent],
  templateUrl: './pprl-dashboard.component.html',
  styleUrl: './pprl-dashboard.component.scss'
})
export class PprlDashboardComponent {}
