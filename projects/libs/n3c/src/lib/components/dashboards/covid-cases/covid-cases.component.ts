import {Component, ElementRef, inject, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {ConfigFile} from '@odp/n3c/lib/services/base-manager/base.manager.types';

import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {KpiPanelComponent} from '../../shared/kpi-panel/kpi-panel.component';
import {LimitationsComponent} from '../../shared/limitations/limitations.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {TopicPickerComponent} from '../../shared/topic-picker/topic-picker.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {ColDef, GridOptions} from 'ag-grid-community';
import {GridComponent} from '../../shared/data-grid/data-grid.component';
import {PositiveCase} from '@odp/n3c/lib/models/covid-cases';
import * as CONST from './constants';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {CovidCasesManager} from './covid-cases.service';
import {CovidCasesApiService} from '@odp/n3c/lib/services/api/covid-cases-api/covid-cases-api.service';
import {forkJoin} from 'rxjs';
import {CovidDailyChartService} from './covid-daily-chart.service';
import {CovidCumulativeChartService} from './covid-cumulative-chart.service';
import {GlobalUtilsService} from '@odp/n3c/lib/services/global-utils.service';

@Component({
  selector: 'app-covid-cases',
  imports: [
    HeaderViewComponent,
    N3cLoaderComponent,
    TopicPickerComponent,
    LimitationsComponent,
    RouterModule,
    DashboardFooterComponent,
    KpiPanelComponent,
    GridComponent
  ],
  providers: [CovidCumulativeChartService, CovidDailyChartService],
  templateUrl: './covid-cases.component.html',
  styleUrl: './covid-cases.component.scss'
})
export class CovidCasesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', {static: true}) chartContainer!: ElementRef;
  private resizeObserver!: ResizeObserver;
  private chartService!: CovidDailyChartService | CovidCumulativeChartService;

  showError = false;
  dataLoading = true;
  title = '';
  validTopics = CONST.validTopics();
  topicOptions = CONST.topicOptions;
  patientData: PositiveCase[] = [];
  kpiConfigs: KpiPanelConfig = [];
  limitationsConfig!: LimitationsConfig;
  currentConfig = {} as ConfigFile;
  selectedTopic = 'daily';
  columnDefs: ColDef[] = CONST.columnDefs;
  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 25, 50, 75, 100],
    domLayout: 'autoHeight'
  };
  isTooltipOpen = false;

  private titleService = inject(Title);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private siteMapApi = inject(SitemapApiService);
  private manager = inject(CovidCasesManager);
  private api = inject(CovidCasesApiService);
  private dailyChartService = inject(CovidDailyChartService);
  private cumulativeChartService = inject(CovidCumulativeChartService);
  private globalUtils = inject(GlobalUtilsService);

  constructor() {
    this.titleService.setTitle('N3C Dashboard - Cumulative and Average COVID+ Cases');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const topic = params.get('id') || '';
      this.resolveTopicFromRoute(topic);
      this.dataLoading = true;

      try {
        const {config, limitations} = await this.manager.loadConfigs(this.selectedTopic);
        this.currentConfig = config;
        this.kpiConfigs = config.kpiPanelConfig;
        this.limitationsConfig = limitations;
        this.loadPatientData();
      } catch (error) {
        this.showError = true;
        console.error(`Failed to load configuration for topic: ${this.selectedTopic}`, error);
      }
    });
  }

  ngAfterViewInit(): void {
    // Observe container size and redraw chart on resize
    this.resizeObserver = new ResizeObserver(() => {
      if (this.patientData.length) {
        this.chartService.draw(this.patientData, this.chartContainer.nativeElement);
      }
    });
    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  private resolveTopicFromRoute(topic: string | null): void {
    if (topic && this.validTopics.includes(topic)) {
      this.selectedTopic = topic;
      this.title = this.topicOptions.find((t) => t.value === topic)?.label || '';

      this.chartService = topic === 'daily' ? this.dailyChartService : this.cumulativeChartService;
    } else {
      this.router.navigate([`../${this.validTopics[0]}`], {relativeTo: this.route});
    }
  }

  private loadPatientData(): void {
    const mainData$ = this.api.getPositiveCases();
    const parentKpi$ = this.siteMapApi.getFactSheet();

    forkJoin([mainData$, parentKpi$]).subscribe({
      next: ([mainData, parentKpi]) => {
        this.patientData = mainData.rows;

        const covidPos = this.globalUtils.formatLargeNumber(parentKpi.covid_positive_patients, 3);
        this.manager.setKPIStatState('numTCP', covidPos, 'M', 2);
        this.manager.calculateTotals(this.patientData, 2);
        this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig)!;
        this.chartService.draw(this.patientData, this.chartContainer.nativeElement);

        this.dataLoading = false;
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.showError = true;
        this.dataLoading = false;
      }
    });
  }

  onTopicChanged(newTopic: string) {
    this.router.navigate(['../', newTopic], {relativeTo: this.route});
  }

  toggleTooltip() {
    this.isTooltipOpen = !this.isTooltipOpen;
  }
}
