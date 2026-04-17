import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MenuComponent {
  menuItems!: any;
  secondSub!: any;

  private httpClient = inject(HttpClient);

  constructor() {
    this.httpClient.get('assets/menu.json').subscribe((data) => {
      this.menuItems = data;
    });
  }
}
