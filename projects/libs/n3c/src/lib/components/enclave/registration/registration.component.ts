import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';

@Component({
  selector: 'app-n3c-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  imports: [CommonModule, RouterModule, MatIconModule, MatExpansionModule, N3cMenuComponent, HeaderViewComponent]
})
export class N3cRegistrationComponent extends N3cBaseComponent implements OnInit {
  private titleService = inject(Title);

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C Onboarding');
  }
}
