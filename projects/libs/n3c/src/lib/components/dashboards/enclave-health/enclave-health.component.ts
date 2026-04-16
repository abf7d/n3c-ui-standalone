import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {GridComponent} from '../../shared/data-grid/data-grid.component';
import {DataFiltersComponent} from '../../shared/data-filters/data-filters.component';
import {KpiPanelComponent} from '../../shared/kpi-panel/kpi-panel.component';
import {LimitationsComponent} from '../../shared/limitations/limitations.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {TopicPickerComponent} from '../../shared/topic-picker/topic-picker.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import * as CONST from './constants';
import {ConfigFile, FilterDef} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {Title} from '@angular/platform-browser';
import {EnclaveHealthApiService} from '@odp/n3c/lib/services/api/enclave-health-api/enclave-health-api.service';
import {EnclaveHealthManager} from './enclave-health.service';
import {SelectedFilters} from './enclave-health.interface';
import {PatientData} from '@odp/n3c/lib/models/enclave-health';
import {KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {forkJoin} from 'rxjs';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {RenderChartComponent} from '../../shared/render-chart/render-chart.component';
import {ColDef, GridOptions} from 'ag-grid-community';

@Component({
  selector: 'app-enclave-health',
  imports: [
    CommonModule,
    RouterModule,
    GridComponent,
    DataFiltersComponent,
    KpiPanelComponent,
    HeaderViewComponent,
    N3cLoaderComponent,
    DashboardFooterComponent,
    TopicPickerComponent,
    LimitationsComponent,
    RenderChartComponent
  ],
  templateUrl: './enclave-health.component.html',
  styleUrl: './enclave-health.component.scss'
})
export class EnclaveHealthComponent implements OnInit {
  showError = false;
  dataLoading = true;
  selectedFilters: SelectedFilters = CONST.selectedFilters(); // state for storing selected filters
  title = '';
  chartsConfig: any[] = [];
  patientData: PatientData[] = [];
  filteredData: PatientData[] = [];
  kpiConfigs: KpiPanelConfig = [];
  limitationsConfig!: LimitationsConfig;
  currentConfig = {} as ConfigFile;
  progressBarMax: number = 0;
  validTopics = CONST.validTopics();
  topicOptions = CONST.topicOptions;
  filterMap: FilterDef[][] = [];
  selectedTopic = 'comorbidities';
  columnDefs: ColDef[] = [];
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
  displayMode: 'bar' | 'percent' | 'pie' = 'bar';

  constructor(
    private api: EnclaveHealthApiService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private manager: EnclaveHealthManager,
    private siteMapApi: SitemapApiService
  ) {
    this.titleService.setTitle('N3C Dashboard - Enclave Health');
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

  private resolveTopicFromRoute(topic: string | null): void {
    if (topic && this.validTopics.includes(topic)) {
      this.selectedTopic = topic;
      this.title = this.topicOptions.find((t) => t.value === topic)?.label || '';
    } else {
      this.router.navigate([`../${this.validTopics[0]}`], {relativeTo: this.route});
    }
    this.filterMap = CONST.filterMap(this.selectedTopic);
  }

  private loadPatientData(): void {
    const mainData$ = this.api.callApiByTopic(this.selectedTopic);
    const parentKpi$ = this.siteMapApi.getFactSheet();

    forkJoin([mainData$, parentKpi$]).subscribe({
      next: ([mainData, parentKpi]) => {
        this.patientData = <PatientData[]>mainData.rows;
        this.filteredData = this.patientData;

        // Calculate the max value for top kpi panel progress bar so can get a percent when we filter
        this.progressBarMax = this.filteredData
          .filter((item: any) => !isNaN(Number(item.patient_count))) // Keep only valid numbers
          .reduce((sum: number, item: any) => sum + Number(item.patient_count), 0);

        const totals = this.manager.calculateTotals(this.filteredData, 2);
        const totalPatients = Object.values(totals['sexTotals'])?.reduce((sum, item) => sum + item.count, 0);

        this.manager.setKPIStatState('numTPIE', parentKpi.person_rows, 'M', 1);
        this.manager.setKPIStatState('numTPWM', totalPatients, 'M', 2);

        this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig)!;
        this.chartsConfig = this.manager.initializeChartsConfig(totals, this.currentConfig);

        this.columnDefs = CONST.getColumnDefs(this.selectedTopic);
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
    // Filter the data based on selected filters
    this.filteredData = this.manager.filterDataBasedOnSelectedFilters(this.patientData, this.selectedFilters);

    // Recalculate totals and KPIs values with the filtered data
    const totals = this.manager.calculateTotals(this.filteredData, 2);

    const filteredCount = this.filteredData
      .filter((item: any) => !isNaN(Number(item.patient_count))) // Keep only valid numbers
      .reduce((sum: number, item: any) => sum + Number(item.patient_count), 0);

    // First, update KPI configs for top KPI panel
    const newKpiConfigs = this.manager.updateKpiConfigs(this.currentConfig)!;

    // Then update the KPI progress bar (ensure it uses updated filteredCount)
    const indexProgBarInKpiPanel = CONST.indexProgBarInKpiPanelMap[this.selectedTopic]; // Location in the top kpi panel for progress bar updates
    this.kpiConfigs = this.manager.updateKpiProgressBar(
      newKpiConfigs,
      filteredCount,
      this.progressBarMax,
      indexProgBarInKpiPanel
    );

    this.chartsConfig = this.manager.initializeChartsConfig(totals, this.currentConfig);
  }

  updateFiltersForCharts(selected: {label: string; groupName: string}): void {
    this.selectedFilters = this.manager.toggleChartFilter<SelectedFilters>(this.selectedFilters, selected);
    this.applyFilters();
  }

  updateFilters(selected: {[key: string]: string[]}): void {
    this.selectedFilters = this.manager.buildSelectedFilters(selected);
    this.applyFilters();
  }

  setDisplayMode(mode: 'bar' | 'percent' | 'pie'): void {
    this.displayMode = mode;

    this.manager.displayMode = mode;

    this.chartsConfig.forEach((chart) => {
      chart.displayMode = mode;
      chart.title = chart.titleMap?.[mode] || chart.title;
    });
  }
}
