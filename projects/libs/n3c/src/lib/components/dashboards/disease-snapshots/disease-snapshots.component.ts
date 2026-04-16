import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {DiseaseSnapshotsApiService} from '@odp/n3c/lib/services/api/disease-snapshots-api/disease-snapshots-api';
import {DiseaseSnapshotsManager} from './disease-snapshots.service';
import {ConfigFile, SelectedFilters} from './disease-snapshots.interface';
import * as CONST from './constants';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {PatientData} from '@odp/n3c/lib/models/disease-snapshots';
import {KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {FilterDef} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {ColDef, GridOptions} from 'ag-grid-community';
import {GridComponent} from '../../shared/data-grid/data-grid.component';
import {DataFiltersComponent} from '../../shared/data-filters/data-filters.component';
import {KpiPanelComponent} from '../../shared/kpi-panel/kpi-panel.component';
import {LimitationsComponent} from '../../shared/limitations/limitations.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {TopicPickerComponent} from '../../shared/topic-picker/topic-picker.component';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {forkJoin, switchMap} from 'rxjs';

import {GroupedBarChartComponent} from '../../shared/grouped-bar-chart/grouped-bar-chart.component';
import {N3cTooltipComponent} from '../../shared/tooltip/tooltip.component';
import {ChartGroup} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar.interface';
import {GlobalUtilsService} from '@odp/n3c/lib/services/global-utils.service';

@Component({
  selector: 'app-disease-snapshots',
  imports: [
    RouterModule,
    GridComponent,
    DataFiltersComponent,
    KpiPanelComponent,
    HeaderViewComponent,
    N3cLoaderComponent,
    DashboardFooterComponent,
    TopicPickerComponent,
    LimitationsComponent,
    GroupedBarChartComponent,
    N3cTooltipComponent
  ],
  templateUrl: './disease-snapshots.component.html',
  styleUrl: './disease-snapshots.component.scss'
})
export class DiseaseSnapshotsComponent implements OnInit {
  showError = false;
  dataLoading = true;
  selectedFilters: SelectedFilters = CONST.selectedFilters(); // state for storing selected filters
  title = '';
  chartConfig: ChartGroup[][] = [];
  patientData: PatientData[] = [];
  filteredData: PatientData[] = [];
  kpiConfigs: KpiPanelConfig = [];
  limitationsConfig!: LimitationsConfig;
  currentConfig = {} as ConfigFile;
  validTopics = CONST.validTopics();
  topicOptions = CONST.topicOptions;
  filterMap: FilterDef[][] = [];
  selectedTopic = 'comorbidities';
  columnDefs: ColDef[] = CONST.columnDefs;
  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 25, 50, 75, 100],
    quickFilterText: '',
    domLayout: 'autoHeight',
    context: {
      showSearchBox: true,
      searchBoxWidth: '400px'
    }
  };

  constructor(
    private api: DiseaseSnapshotsApiService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private manager: DiseaseSnapshotsManager,
    private siteMapApi: SitemapApiService,
    private globalUtils: GlobalUtilsService
  ) {
    this.titleService.setTitle('N3C Dashboard - Disease Snapshots');
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const topic = params.get('id') || '';
          this.resolveTopicFromRoute(topic);
          this.dataLoading = true;
          return this.manager.loadConfigs(this.selectedTopic);
        })
      )
      .subscribe({
        next: ({config, limitations}) => {
          this.currentConfig = config;
          this.kpiConfigs = config.kpiPanelConfig;
          this.limitationsConfig = limitations;
          this.loadPatientData();
          this.dataLoading = false;
        },
        error: (error) => {
          this.showError = true;
          this.dataLoading = false;
          console.error(`Failed to load configuration`, error);
        }
      });
  }

  private resolveTopicFromRoute(topic: string | null): void {
    if (topic && this.validTopics.includes(topic)) {
      this.selectedTopic = topic;
      this.title = this.topicOptions.find((t) => t.value === topic)?.label || '';
    } else {
      this.router.navigate([`../${this.validTopics[0]}`], {relativeTo: this.route});
    }
    this.filterMap = CONST.filterMap();
  }

  private loadPatientData(): void {
    const mainData$ = this.api.callApiByTopic(this.selectedTopic);
    const parentKpi$ = this.siteMapApi.getFactSheet();

    forkJoin([mainData$, parentKpi$]).subscribe({
      next: ([mainData, parentKpi]) => {
        this.patientData = <PatientData[]>mainData.rows;
        this.filteredData = this.patientData;

        const covidPos = this.globalUtils.formatLargeNumber(parentKpi.covid_positive_patients, 3);
        this.manager.setKPIStatState('numTPIE', parentKpi.person_rows, 'M', 1);
        this.manager.setKPIStatState('numTCP', covidPos.replace(/,/g, '') || '0', 'M', 2);
        this.manager.calculateTotals(this.filteredData, 2);
        this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig)!;
        this.chartConfig = this.manager.buildCharts(this.filteredData, this.currentConfig, this.filterMap);

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

  private applyFilters() {
    this.filteredData = this.manager.filterDataBasedOnSelectedFilters(this.patientData, this.selectedFilters);

    this.manager.calculateTotals(this.filteredData, 2);
    this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig)!;
    this.chartConfig = this.manager.buildCharts(this.filteredData, this.currentConfig, this.filterMap);
  }

  updateFiltersForCharts(selected: {label: string; groupName: string}): void {
    this.selectedFilters = this.manager.toggleChartFilter<SelectedFilters>(this.selectedFilters, selected);
    this.applyFilters();
  }

  updateFilters(selected: {[key: string]: string[]}): void {
    this.selectedFilters = this.manager.buildSelectedFilters(selected);
    this.applyFilters();
  }
}
