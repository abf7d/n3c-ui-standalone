import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MobileMenuComponent} from './mobile-menu/mobile-menu.component';
import {HeaderViewComponent} from './header-view/header-view.component';
import {MenuComponent} from './menu/menu.component';
import {MatListModule as MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatExpansionModule} from '@angular/material/expansion';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FooterViewComponent} from './footer/footer-view/footer-view.component';
import {ExternalLinkComponent} from './external-link/external-link.component';
import {LoaderComponent} from './loader/loader.component';
import {FixedMenuComponent} from './fixed-menu/fixed-menu.component';
import {FixedHeaderComponent} from './fixed-header/fixed-header.component';
import {PortalMenuComponent} from './portal-layout/menu/menu.component';
import {PortalHeaderViewComponent} from './portal-layout/header-view/header-view.component';
import {PortalMobileMenuComponent} from './portal-layout/mobile-menu/mobile-menu.component';
import {PortalFooterViewComponent} from './portal-layout/footer/footer-view/footer-view.component';
import {N3cBaseComponent} from './n3c/base/base.component';

@NgModule({
  declarations: [
    MobileMenuComponent,
    FixedMenuComponent,
    FixedHeaderComponent,
    N3cBaseComponent,
    PortalMobileMenuComponent,
    PortalFooterViewComponent
  ],
  exports: [
    MobileMenuComponent,
    HeaderViewComponent,
    MenuComponent,
    ExternalLinkComponent,
    LoaderComponent,
    FixedHeaderComponent,
    FixedMenuComponent,
    FooterViewComponent,
    PortalMenuComponent,
    PortalHeaderViewComponent,
    PortalMobileMenuComponent,
    N3cBaseComponent
  ],
  imports: [
    CommonModule,
    MatListModule,
    RouterModule,
    MatSidenavModule,
    MatExpansionModule,
    HeaderViewComponent,
    MenuComponent,
    FooterViewComponent,
    ExternalLinkComponent,
    LoaderComponent,
    PortalMenuComponent,
    PortalHeaderViewComponent
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class SharedModule {}
