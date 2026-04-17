import {Component, OnInit, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Router, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';

@Component({
  selector: 'app-about',
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule, FormsModule, N3cMenuComponent, HeaderViewComponent]
})
export class N3CSearchResultsComponent extends N3cBaseComponent implements OnInit {
  tiles: any[] = [];
  searchTerm: string = '';

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const navigation = this.router.currentNavigation();
    this.tiles = history.state.tiles || [];

    this.route.params.subscribe((params) => {
      this.searchTerm = params['searchTerm'];
    });
  }
}
