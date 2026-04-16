import {Component, AfterViewInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {dashboard_tiles} from '../../../constants/dashboards';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';

@Component({
  selector: 'app-about',
  templateUrl: './dataDistribution-demographics.component.html',
  styleUrls: ['./dataDistribution-demographics.component.scss'],
  imports: [RouterModule, MatIconModule, FormsModule, HeaderViewComponent]
})
export class DataDistributionDemographicsComponent implements AfterViewInit {
  filteredDashboardTiles: any[] = [];

  ngAfterViewInit(): void {
    this.fetchFilteredTiles();
  }

  fetchFilteredTiles(): void {
    // Assuming dashboard_tiles is imported and contains all tiles
    const tiles = dashboard_tiles;

    // Filter the tiles based on your conditions (e.g., id)
    this.filteredDashboardTiles = tiles.filter(
      (tile) =>
        tile.id === 'Regional_Distribution_of_COVID_Patients' ||
        tile.id === 'Collaboration_Networks' ||
        tile.id === 'Demographics_Table_for_IRB' ||
        tile.id === 'Demographics'
    );
  }

  // Method to navigate to a link when a tile is clicked
  navigateTo(url: string): void {
    window.location.href = url;
  }
}
