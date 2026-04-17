import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {ViewEncapsulation} from '@angular/core';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-cancer',
  templateUrl: './cancer.component.html',
  styleUrl: './cancer.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    N3cMenuComponent,
    N3cLoaderComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cCancerComponent extends N3cBaseComponent implements OnInit {
  private titleService = inject(Title);

  ngOnInit() {
    this.initDataByRoute({landingPage: true});
    this.titleService.setTitle('N3C - Cancer');
  }
}
