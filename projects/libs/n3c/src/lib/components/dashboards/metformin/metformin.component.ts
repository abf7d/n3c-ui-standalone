import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {saveAs} from 'file-saver';
import {GridComponent} from '../../../components/shared/data-grid/data-grid.component';
import {RenderChartComponent} from '../../../components/shared/render-chart/render-chart.component';
import {KpiStatsApiService} from '../../../services/api/kpi-stats-api/kpi-stats-api.service';
import {SearchDashboardsComponent} from '../../shared/search-dashboards/search-dashboards.component';
import {DataFiltersComponent} from '../../shared/data-filters/data-filters.component';
import {KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';
import {KpiPanelComponent} from '../../shared/kpi-panel/kpi-panel.component';
import metformin1Config from './metformin_1.config.json';
import metformin2Config from './metformin_2.config.json';
import metformin3Config from './metformin_3.config.json';
import metformin4Config from './metformin_4.config.json';
import metformin5Config from './metformin_5.config.json';
import {MetforminManager} from './services/metformin.manager';
import {ConfigFile, SelectedFilters, TitleMap, TotalsObject} from './types';
import * as CONST from './const';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';

@Component({
  selector: 'app-metformin',
  templateUrl: './metformin.component.html',
  styleUrls: ['./metformin.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    GridComponent,
    RenderChartComponent,
    SearchDashboardsComponent,
    DataFiltersComponent,
    KpiPanelComponent,
    HeaderViewComponent
  ]
})
export class MetforminComponent implements OnInit {
  public showError = false;
  public dataLoading = true;
  public kpiConfigs: KpiPanelConfig = [];
  public isLoading: boolean = true;
  public selectedDataset: string;
  public currentConfig: ConfigFile | null = null;
  public originalTotalCount: number = 0; // Dynamic value based on dataset
  public filteredCount: number = 0; // Tracks filtered count for the progress bar
  public isLimitationsCollapsed = false;
  public filteredData: any[] = []; // Data for AG grid and other calcs
  public displayMode: 'bar' | 'percent' | 'pie' = 'bar'; // Default display mode
  public filterMap = CONST.filterMap(); // for building the data-filters component
  public chartsConfig: any[] = []; // Empty initially
  public columnDefs: any[] = [];
  public gridOptions = {
    headerHeight: 80,
    pagination: true,
    paginationPageSize: 20,
    quickFilterText: '', // Enables the quick filter functionality
    domLayout: 'autoHeight',
    context: {
      showSearchBox: true, // Add this to toggle the search box
      searchBoxWidth: '400px' // Add this to set the width of the search box
    }
  };

  private selectedFilters: SelectedFilters = CONST.selectedFilters(); // state for storing selected filters
  private totals!: TotalsObject;
  private metforminData: any;

  private titleService = inject(Title);
  private http = inject(HttpClient);
  private KpiStatsApi = inject(KpiStatsApiService);
  private manager = inject(MetforminManager);

  constructor() {
    this.titleService.setTitle('N3C Frequently Asked Questions');
    this.selectedDataset = 'metformin_1';
  }

  ngOnInit() {
    const defaultDataset = 'metformin_1'; // Default dataset
    const datasetConfig = this.getDatasetConfig(defaultDataset);
    if (!datasetConfig) {
      console.error(`Default dataset configuration not found for: ${defaultDataset}`);
      return;
    }
    this.selectedDataset = defaultDataset;

    // Dynamically import the config for the default dataset
    import(`./${defaultDataset}.config.json`)
      .then((config) => {
        this.currentConfig = config; // Set the currentConfig
        this.loadDataForDataset(datasetConfig.apiEndpoint).then(() => {
          this.isLoading = false;

          // Initialize charts and KPIs with the loaded config
          this.manager.initializeChartsConfig(this.totals, config, datasetConfig.chartIdPrefix);
          this.kpiConfigs = this.manager.updateKpiConfigs(config)!;
          this.updateColumnDefs();
        });
      })
      .catch((error) => {
        console.error(`Failed to load default configuration: ${defaultDataset}`, error);
      });
  }

  getTitleForChart(key: keyof TitleMap, mode: 'bar' | 'percent' | 'pie'): string {
    return this.currentConfig?.titleMap[key]?.[mode] ?? 'Title Not Found';
  }

  // For ag grid
  private updateColumnDefs(): void {
    if (!this.filteredData || this.filteredData.length === 0) {
      console.warn('No filtered data available to determine column definitions.');
      return;
    }

    // Aaron pull out into manager service
    // Set MAIN column definitions for the grid - these dont change
    this.columnDefs = [
      {field: 'race', headerName: 'Race', width: 150, sortable: true, filter: 'agTextColumnFilter', resizable: true},
      {field: 'ethnicity', headerName: 'Ethnicity', width: 150, filter: 'agTextColumnFilter', resizable: true},
      {field: 'age', headerName: 'Age', width: 80, filter: 'agTextColumnFilter', resizable: true},
      {field: 'sex', headerName: 'Sex', width: 80, filter: 'agTextColumnFilter', resizable: true},
      {field: 'severity', headerName: 'Severity', width: 120, filter: 'agTextColumnFilter', resizable: true},
      {field: 'covid_status', headerName: 'COVID Status', width: 120, filter: 'agTextColumnFilter', resizable: true},
      {
        field: 'long_covid_status',
        headerName: 'Long COVID Status',
        width: 120,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {
        field: 'vaccination_status',
        headerName: 'Vaccination Status',
        width: 120,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {field: 'mortality', headerName: 'Mortality', width: 120, filter: 'agTextColumnFilter', resizable: true},
      {
        field: 'metformin_occurrence',
        headerName: 'Metformin Occurrence',
        width: 150,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {field: 'patient_count', headerName: 'Patient Count', width: 120, filter: 'agTextColumnFilter', resizable: true}
    ];

    // Dynamically add 'metformin_status' column if it exists in the dataset
    if ('metformin_status' in this.filteredData[0]) {
      this.columnDefs.unshift({
        // make it 1st column
        field: 'metformin_status',
        headerName: 'Metformin Status',
        width: 150,
        filter: 'agTextColumnFilter',
        resizable: true
      });

      // Remove 'ethnicity' column if 'metformin_status' exists
      this.columnDefs = this.columnDefs.filter((col) => col.field !== 'ethnicity');
    }

    // Dynamically add 'diabetic_status' column if it exists in the dataset
    if ('diabetes_status' in this.filteredData[0]) {
      this.columnDefs.push({
        field: 'diabetes_status',
        headerName: 'Diabetic Status',
        width: 150,
        filter: 'agTextColumnFilter',
        resizable: true
      });
    }

    // Check if "CCI Score" exists in the dataset and add the column dynamically
    if ('cci_score' in this.filteredData[0]) {
      this.columnDefs.push({
        field: 'cci_score',
        headerName: 'CCI Score',
        width: 120,
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true
      });
    }
  }

  // Aaron check what this is
  toggleCollapse(panelId: string) {
    switch (panelId) {
      case 'metformin_5limitations_body':
        this.isLimitationsCollapsed = !this.isLimitationsCollapsed;
        break;
      default:
        console.warn(`No collapse state found for panel ID: ${panelId}`);
    }
  }

  saveAs(format: string, vizId: string) {
    const element = document.getElementById(vizId);
    if (!element) return;

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => {
          saveAs(dataUrl, `${vizId}.jpg`);
        });
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => {
          saveAs(dataUrl, `${vizId}.png`);
        });
        break;
      case 'svg':
        toSvg(element).then((dataUrl) => {
          saveAs(dataUrl, `${vizId}.svg`);
        });
        break;
    }
  }

  onDatasetChange(event: Event): void {
    const dataset = (event.target as HTMLSelectElement).value;

    // Now call the existing logic to handle the dataset change
    const datasetConfig = this.getDatasetConfig(dataset);
    if (!datasetConfig) {
      console.error(`Dataset configuration not found for: ${dataset}`);
      return;
    }

    this.selectedDataset = dataset;
    this.isLoading = true;

    // Dynamically import the config file
    import(`./${dataset}.config.json`)
      .then((config) => {
        this.currentConfig = config; // Set the currentConfig
        this.loadDataForDataset(datasetConfig.apiEndpoint).then(() => {
          // Initialize charts and KPIs with the loaded config
          this.manager.initializeChartsConfig(
            this.totals,
            config,
            /* new ChartColorConfig(),*/ datasetConfig.chartIdPrefix
          );
          this.kpiConfigs = this.manager.updateKpiConfigs(config)!;
          this.updateColumnDefs(); // AG grid
          this.isLoading = false;
        });
      })
      .catch((error) => {
        console.error(`Failed to load configuration for dataset: ${dataset}`, error);
        this.isLoading = false;
      });
  }

  // Api Service
  // Aaron Refactor this into ConfigFile
  getDatasetConfig(dataset: string): {apiEndpoint: string; chartIdPrefix: string; config: any} | null {
    // Hardcoded API endpoints and chartIdPrefix
    const hardcodedConfigs: {[key: string]: {apiEndpoint: string; chartIdPrefix: string}} = {
      metformin_1: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/smsc-xrgb.json?',
        chartIdPrefix: 'metformin_1'
      },
      metformin_5: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/i5jg-tdu3.json?',
        chartIdPrefix: 'metformin_5'
      },
      metformin_2: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/exda-rdzd.json?',
        chartIdPrefix: 'metformin_2'
      },
      metformin_3: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/7ap8-hub7.json?',
        chartIdPrefix: 'metformin_3'
      },
      metformin_4: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/eh23-97qn.json?',
        chartIdPrefix: 'metformin_4'
      }
    };

    // Import JSON configs
    const jsonConfigs: {[key: string]: any} = {
      metformin_1: metformin1Config,
      metformin_2: metformin2Config,
      metformin_3: metformin3Config,
      metformin_4: metformin4Config,
      metformin_5: metformin5Config
    };

    // Get the hardcoded and JSON configs for the selected dataset
    const hardcodedConfig = hardcodedConfigs[dataset];
    const jsonConfig = jsonConfigs[dataset];

    if (!hardcodedConfig || !jsonConfig) {
      console.error(`Configuration not found for dataset: ${dataset}`);
      return null;
    }

    // Merge the hardcoded config with the JSON config
    return {
      ...hardcodedConfig,
      config: jsonConfig
    };
  }

  loadDataForDataset(apiEndpoint: string): Promise<void> {
    const limit = 1000;

    return new Promise<void>((resolve, reject) => {
      this.http.get<{count: string}[]>(`${apiEndpoint}$select=count(*)`).subscribe({
        next: (result) => {
          const totalRecords = parseInt(result[0].count, 10);
          const requests$ = [];
          for (let offset = 0; offset < totalRecords; offset += limit) {
            const url = `${apiEndpoint}$limit=${limit}&$offset=${offset}`;
            requests$.push(this.http.get<any[]>(url));
          }

          const kpistats$ = this.KpiStatsApi.getEnclaveMetrics();

          forkJoin([...requests$, kpistats$]).subscribe({
            next: (responses) => {
              const kpistats = responses.pop();
              const allData = responses.flat();

              this.metforminData = allData;
              this.filteredData = this.metforminData;

              // Calculate the original total count
              this.originalTotalCount = allData
                .filter((item) => !isNaN(Number(item.patient_count))) // Keep only valid numbers
                .reduce((sum, item) => sum + Number(item.patient_count), 0);

              // Initialize filteredCount to the original count
              this.filteredCount = this.originalTotalCount;

              // Calculate totals and update variables, stores in state for later use
              this.totals = this.manager.calculateTotals(this.metforminData);

              // Initialize KPI configs after totals are updated
              this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig!)!;

              // Initialize charts config AFTER totals are set
              this.chartsConfig = this.manager.initializeChartsConfig(this.totals, this.currentConfig!)!;

              // Set KPI stats
              this.manager.setKPIStat('numTPIE', kpistats['person_rows']['value'], 'M', 1);

              // Update filterMap based on the presence of CCI Score
              this.filterMap = this.manager.updateFilterMap(this.filteredData, this.filterMap);

              this.dataLoading = false;
              resolve();
            },
            error: (error) => {
              console.error('Error loading data', error);
              this.showError = true;
              this.dataLoading = false;
              reject(error);
            }
          });
        },
        error: (error) => {
          console.error('Error fetching total number of records', error);
          reject(error);
        }
      });
    });
  }

  // Aaron
  // This is output param from the data-filters
  public updateFilters(selectedFilters: {[key: string]: string[]}) {
    // Update selected filters
    // this.selectedFilters = this.manager.populateSelectedFilters(selectedFilters)
    this.selectedFilters = {
      age: selectedFilters['Age'] || [],
      sex: selectedFilters['Sex'] || [],
      race: selectedFilters['Race'] || [],
      severity: selectedFilters['Severity'] || [],
      ethnicity: selectedFilters['Ethnicity'] || [],
      medoccurrence: selectedFilters['Medication Occurrence'] || [],
      covidstatus: selectedFilters['COVID Status'] || [],
      longcovidstatus: selectedFilters['Long COVID Status'] || [],
      vaccinationstatus: selectedFilters['Vaccination Status'] || [],
      mortality: selectedFilters['Mortality Status'] || [],
      cciscore: selectedFilters['CCI Score'] || []
    };

    // Apply filters
    this.applyFilters();
  }

  // Filter data based on the selected filters and update the page
  applyFilters() {
    // Filter the data based on selected filters
    const filteredData = this.manager.filterDataBasedOnSelectedFilters(this.metforminData, this.selectedFilters);
    this.filteredData = filteredData; // Pass this to the grid

    // Recalculate totals and KPIs with the filtered data
    this.totals = this.manager.calculateTotals(filteredData);

    this.filteredCount = filteredData
      .filter((item: any) => !isNaN(Number(item.patient_count))) // Keep only valid numbers
      .reduce((sum: number, item: any) => sum + Number(item.patient_count), 0);

    // First, update KPI configs
    const newKpiConfigs = this.manager.updateKpiConfigs(this.currentConfig!)!;

    // Then update the KPI progress bar (ensure it uses updated filteredCount), re
    this.kpiConfigs = this.manager.updateKpiProgressBar(newKpiConfigs, this.filteredCount, this.originalTotalCount);

    // Finally, refresh all charts
    this.chartsConfig = this.manager.initializeChartsConfig(this.totals, this.currentConfig!);
  }

  setDisplayMode(mode: 'bar' | 'percent' | 'pie'): void {
    this.displayMode = mode; // Update the main display mode

    // Update each chart's displayMode in the chartsConfig array
    this.chartsConfig.forEach((chart) => {
      chart.displayMode = mode;
    });
  }
}
