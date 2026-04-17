import {Component, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AdminInstCount, AdminUserCount, DuaEntry} from '@odp/n3c/lib/models/admin-models';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {DuaLineChartService} from '@odp/n3c/lib/services/charts/dua-line/dua-line.service';
import {InstitutionLineChartService} from '@odp/n3c/lib/services/charts/dua-line/institutions_line.server';
import saveAs from 'file-saver';
import {toJpeg, toPng, toSvg} from 'html-to-image';
import {forkJoin} from 'rxjs';
import {RouterModule} from '@angular/router';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-site-user-metrics',
  imports: [RouterModule, HeaderViewComponent, DashboardFooterComponent, N3cLoaderComponent],
  providers: [DuaLineChartService, InstitutionLineChartService],
  templateUrl: './site-user-metrics.component.html',
  styleUrl: './site-user-metrics.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SiteUserMetricsComponent implements OnInit {
  public adminInstCount!: AdminInstCount;
  public adminUserCount!: AdminUserCount;
  public showError = false;
  public dataLoading = true;
  public showInstMenu = false;
  public showUserMenu = false;
  @ViewChild('lineChart', {static: true}) lineChart!: ElementRef;
  @ViewChild('instLineChart', {static: true}) instLineChart!: ElementRef;
  private siteApi = inject(SitemapApiService);
  private duaLine = inject(DuaLineChartService);
  private instLine = inject(InstitutionLineChartService);

  ngOnInit(): void {
    const duaData$ = this.siteApi.getDuaData();
    const adminInst$ = this.siteApi.adminInstitutions();
    const adminUser$ = this.siteApi.adminUsers();
    this.dataLoading = true;
    this.showError = false;
    forkJoin([duaData$, adminInst$, adminUser$]).subscribe(
      ([duaData, adminInst, adminUser]: [DuaEntry[], AdminInstCount, AdminUserCount]) => {
        this.duaLine.draw(duaData, this.lineChart.nativeElement);
        this.instLine.draw(duaData, this.instLineChart.nativeElement);
        this.dataLoading = false;
        this.adminInstCount = adminInst;
        this.adminUserCount = adminUser;
      },
      (error) => {
        console.error('Failed to load site metrics data:', error);
        this.showError = true;
        this.dataLoading = false;
      }
    );
  }
  saveAs(format: string, chartType: 'users' | 'institutions', title: string) {
    const element = chartType === 'users' ? this.lineChart.nativeElement : this.instLineChart.nativeElement;

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => saveAs(dataUrl, `${title}.jpg`));
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => saveAs(dataUrl, `${title}.png`));
        break;
      case 'svg':
        toSvg(element).then((dataUrl) => saveAs(dataUrl, `${title}.svg`));
        break;
    }
  }
  toggleInstMenu() {
    this.showInstMenu = !this.showInstMenu;
  }
  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }
}
