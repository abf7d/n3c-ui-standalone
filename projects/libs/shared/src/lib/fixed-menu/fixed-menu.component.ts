import {HttpClient} from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-fixed-menu',
  templateUrl: './fixed-menu.component.html',
  styleUrls: ['./fixed-menu.component.scss'],
  standalone: false
})
export class FixedMenuComponent {
  menuItems: any;

  private httpClient = inject(HttpClient);

  constructor() {
    this.httpClient.get('assets/menu.json').subscribe((data) => {
      this.menuItems = data;
    });
  }
}
