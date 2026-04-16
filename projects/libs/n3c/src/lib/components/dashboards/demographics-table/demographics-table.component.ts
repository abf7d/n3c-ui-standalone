import '../../../ag-grid-setup';

import {Component, OnInit, Renderer2} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridApi, GridOptions, GridReadyEvent} from 'ag-grid-community';
import {KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';
import {DemTableApiService} from '../../../services/api/demographics-table-api/demographics-table-api.service';
import {ConfigFile, PatientData, SelectedFilters} from './demographics-table.interface';
import {DataFiltersComponent} from '../../shared/data-filters/data-filters.component';
import * as CONST from './constants';
import {KpiPanelComponent} from '../../shared/kpi-panel/kpi-panel.component';
import {LimitationsComponent} from '../../shared/limitations/limitations.component';
import {TopicPickerComponent} from '../../shared/topic-picker/topic-picker.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {N3cDemTableManager} from './demographics-table.service';
import {LimitationsConfig} from '../../shared/limitations/limitations.interface';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {forkJoin} from 'rxjs';
import {FilterDef} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {GridComponent} from '../../shared/data-grid/data-grid.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {ChartGroup} from '@odp/n3c/lib/services/charts/stacked-bar/stacked-bar.interface';
import {StackedBarChartsComponent} from '../../shared/stacked-bar-charts/stacked-bar-charts.component';
import {GlobalUtilsService} from '@odp/n3c/lib/services/global-utils.service';

@Component({
  selector: 'app-n3c-demographics-table',
  templateUrl: './demographics-table.component.html',
  styleUrls: ['./demographics-table.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    AgGridAngular,
    KpiPanelComponent,
    TopicPickerComponent,
    DataFiltersComponent,
    LimitationsComponent,
    N3cLoaderComponent,
    GridComponent,
    StackedBarChartsComponent,
    HeaderViewComponent,
    DashboardFooterComponent
  ]
})
export class N3cDemTableComponent implements OnInit {
  private gridApi!: GridApi;

  showError = false;
  dataLoading = true;
  title = '';

  validTopics = CONST.validTopics();
  topicOptions = CONST.topicOptions;
  filterMap: FilterDef[][] = [];

  selectedTopic = 'participant_info';
  isFirstTopic = true;
  currentConfig = {} as ConfigFile;
  limitationsConfig!: LimitationsConfig;
  selectedFilters: SelectedFilters = CONST.selectedFilters();
  kpiConfigs: KpiPanelConfig = [];
  chartConfig: ChartGroup[][] = [];

  patientData: PatientData[] = [];
  filteredData: PatientData[] = [];
  columnDefs: ColDef[] = [];
  defaultColDef = CONST.defaultColDef;
  gridOptions: GridOptions = CONST.gridOptions;
  demoGridOptions: GridOptions = CONST.demoGridOptions;

  constructor(
    private api: DemTableApiService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private manager: N3cDemTableManager,
    private siteMapApi: SitemapApiService,
    private renderer: Renderer2,
    private globalUtils: GlobalUtilsService
  ) {
    this.titleService.setTitle('N3C Dashboard - Demographics Table for IRB Submission');
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
      this.isFirstTopic = this.validTopics[0] === this.selectedTopic;
      this.title = this.topicOptions.find((t) => t.value === topic)?.label || '';
    } else {
      this.router.navigate([`../${this.validTopics[0]}`], {relativeTo: this.route});
    }
    this.filterMap = CONST.filterMap(this.selectedTopic);
  }

  private loadPatientData(): void {
    const mainData$ = this.isFirstTopic ? this.api.getCumulativeSummary() : this.api.getDemographics();
    const parentKpi$ = this.siteMapApi.getFactSheet();

    forkJoin([mainData$, parentKpi$]).subscribe({
      next: ([mainData, parentKpi]) => {
        this.patientData = this.manager.transformPatientData(mainData.rows, this.isFirstTopic);
        this.filteredData = [...this.patientData];

        const covidPos = this.globalUtils.formatLargeNumber(parentKpi.covid_positive_patients, 3);
        this.manager.setKPIStatState('numTCP', covidPos, 'M', 2);
        this.manager.calculateTotals(this.filteredData, 2);
        this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig)!;
        this.chartConfig = this.manager.buildCharts(
          this.filteredData,
          this.currentConfig,
          this.filterMap,
          this.isFirstTopic
        );

        this.columnDefs = this.manager.getColumnDefs(this.isFirstTopic);
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

  downloadCsv() {
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    this.gridApi.exportDataAsCsv({
      fileName: `n3c-demographics-${this.selectedTopic}-${timestamp}.csv`
    });
  }

  updateFilters(selected: {[key: string]: string[]}): void {
    this.selectedFilters = this.manager.buildSelectedFilters(selected);
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredData = this.manager.filterSelectedData(this.patientData, this.selectedFilters, this.isFirstTopic);
    this.manager.calculateTotals(this.filteredData, 2);
    this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig)!;
    this.chartConfig = this.manager.buildCharts(
      this.filteredData,
      this.currentConfig,
      this.filterMap,
      this.isFirstTopic
    );
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }

  updateFiltersForCharts(selected: {label: string; groupName: string}): void {
    this.selectedFilters = this.manager.toggleChartFilter<SelectedFilters>(this.selectedFilters, selected);
    this.applyFilters();
  }

  downloadExcel(selectedFilters?: SelectedFilters) {
    this.api.downloadExcel(selectedFilters || ({} as SelectedFilters)).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = this.renderer.createElement('a');
        this.renderer.setAttribute(a, 'href', url);
        this.renderer.setAttribute(a, 'download', 'N3C_Enclave_Demographics.xlsx');
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading Excel file:', err);
      }
    });
  }
}
