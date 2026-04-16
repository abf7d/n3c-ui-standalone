import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

import {RouterModule} from '@angular/router';
import {dashboard_tiles} from '../../../constants/dashboards';

@Component({
  selector: 'app-search-dashboards',
  templateUrl: './search-dashboards.component.html',
  styleUrls: ['./search-dashboards.component.scss'],
  imports: [RouterModule, MatIconModule, FormsModule]
})
export class SearchDashboardsComponent implements OnInit {
  dashboard_tiles = dashboard_tiles;

  searchTerm: string = '';
  allKeywords: string[] = [];
  filteredKeywords: string[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.extractKeywords();
  }

  extractKeywords() {
    this.dashboard_tiles.forEach((tile) => {
      const words = tile.title.split(' ');
      this.allKeywords.push(...words);
    });
    this.allKeywords = [...new Set(this.allKeywords)];
  }

  onInputChange() {
    this.filteredKeywords = this.allKeywords.filter((keyword) =>
      keyword.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectKeyword(selectedKeyword: string) {
    const matchingTiles = this.dashboard_tiles.filter((tile) =>
      tile.title.toLowerCase().includes(selectedKeyword.toLowerCase())
    );

    this.router.navigate([`dashboard/searchresults/${selectedKeyword}`], {
      state: {tiles: matchingTiles}
    });
  }
}
