import {Component, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ForceDirectedService} from './force-directed/force-directed.service';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';

import {ProjectGraphApiService} from '../../../services/api/project-graph-api/project-graph-api.service';
import * as CONST from '../../../constants/dashboards';
import {FormsModule} from '@angular/forms';
import {NetworkTab} from '../../../models/network-tab';
import {RouterModule} from '@angular/router';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {saveAs} from 'file-saver';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-collaboration-networks',
  imports: [FormsModule, RouterModule, DashboardFooterComponent, HeaderViewComponent, N3cLoaderComponent],
  providers: [ForceDirectedService],
  templateUrl: './collaboration-networks.component.html',
  styleUrl: './collaboration-networks.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CollaborationNetworksComponent implements OnInit {
  @ViewChild('chart', {static: true}) chart!: ElementRef;
  @ViewChild('graphParent', {static: true}) graphParent!: ElementRef;
  public showError = false;
  public dataLoading = true;
  @ViewChild('legend', {static: true}) legend!: ElementRef;

  private projectGraphApi = inject(ProjectGraphApiService);
  private forceDirected = inject(ForceDirectedService);

  public networkOptions = [
    {value: 'Op', viewValue: 'Organizations - Research DURs', api: this.projectGraphApi.getDUROrg()},
    {value: 'Re', viewValue: 'Persons Research DURs', api: this.projectGraphApi.getPersonRsrch()},
    {value: 'Op', viewValue: 'Persons - Operational DURs', api: this.projectGraphApi.getPersonOps()},
    {value: 'Ch', viewValue: 'Challenge DURs (Individuals)', api: this.projectGraphApi.getChallengeIndv()},
    {value: 'Co', viewValue: 'Challenge DURs (Organizations)', api: this.projectGraphApi.getChallengeOrg()}
  ];
  public selectedTab = this.networkOptions[0];

  public onNetworkChange(tab: NetworkTab): void {
    this.loadData(tab);
  }

  public loadData(option: NetworkTab): void {
    this.showError = false;
    this.dataLoading = true;
    const projectGraph$ = option.api.subscribe({
      next: (projectGraph: any) => {
        this.forceDirected.drawChart(this.chart.nativeElement, projectGraph, CONST.PROJECT_ORG_SITES);
        this.dataLoading = false;
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.showError = true;
        this.dataLoading = false;
      }
    });
  }

  ngOnInit() {
    this.forceDirected.initChart(this.chart.nativeElement, this.legend.nativeElement);
    this.loadData(this.selectedTab);
  }

  saveAs(format: string) {
    const element = this.graphParent.nativeElement;
    const title = 'collaboration-graph';
    if (!element) return;

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
}
