import {Input, OnInit, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

import {RouterModule} from '@angular/router';
import {dashboard_tiles} from '../../../constants/dashboards';

@Component({
  selector: 'app-related-dashboards',
  imports: [RouterModule, MatIconModule, FormsModule],
  templateUrl: './related-dashboards.component.html',
  styleUrls: ['./related-dashboards.component.scss']
})
export class RelatedDashboardsComponent implements OnInit {
  @Input() filterTileIds: string[] = [];
  filteredTiles: any[] = [];

  dashboard_tiles = dashboard_tiles;

  ngOnInit(): void {
    this.filterTiles();
  }

  filterTiles(): void {
    if (this.filterTileIds && this.filterTileIds.length > 0) {
      this.filteredTiles = this.dashboard_tiles.filter((tile) => this.filterTileIds.includes(tile.id));
    } else {
      this.filteredTiles = [];
    }
  }

  navigateTo(url: string): void {
    window.location.href = url;
  }
}
