import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-dashboard-footer',
  imports: [RouterModule, MatIconModule, FormsModule],
  templateUrl: './dashboard-footer.component.html',
  styleUrls: ['./dashboard-footer.component.scss']
})
export class DashboardFooterComponent {}
