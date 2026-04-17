import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {RouterModule} from '@angular/router';
import {N3cMenuComponent} from '../menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-page-not-found',
  imports: [CommonModule, RouterModule, N3cMenuComponent, HeaderViewComponent, N3cEnclaveFooterComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent extends N3cBaseComponent implements OnInit {
  private titleService = inject(Title);

  constructor() {
    super();
    this.titleService.setTitle('N3C - Page Not Found');
    this.pageTitle = '404 - Page Not Found';
  }

  ngOnInit() {
    this.initDataByRoute();
  }
}
