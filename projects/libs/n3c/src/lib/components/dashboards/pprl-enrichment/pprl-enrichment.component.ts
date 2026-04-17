import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {saveAs} from 'file-saver';
import {GridComponent} from '../../../components/shared/data-grid/data-grid.component';
import {RenderChartComponent} from '../../../components/shared/render-chart/render-chart.component';
import {DataFiltersComponent} from '../../shared/data-filters/data-filters.component';
import {KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';
import {KpiPanelComponent} from '../../shared/kpi-panel/kpi-panel.component';
import * as CONST from './const';
import {PprlEnrichmentManager} from './services/pprl-enrichment.manager';
import {PprlLimitationComponent} from './pprl-limitation/pprl-limitation.component';
import {API_URLS, Endpoints} from '@odp/shared/lib/types';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {forkJoin} from 'rxjs';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {ColDef} from 'ag-grid-community';
import {ConfigFile} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {KpiPageStats, KpiResult, SelectedFilters} from './types';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-pprl-enrichment',
  imports: [
    CommonModule,
    RouterModule,
    GridComponent,
    RenderChartComponent,
    DataFiltersComponent,
    KpiPanelComponent,
    PprlLimitationComponent,
    HeaderViewComponent,
    N3cLoaderComponent,
    DashboardFooterComponent
  ],
  templateUrl: './pprl-enrichment.component.html',
  styleUrl: './pprl-enrichment.component.scss'
})
export class PprlEnrichmentComponent implements OnInit {
  public showError = false;
  public dataLoading = true;
  public kpiConfigs: KpiPanelConfig = [];
  public isLoading: boolean = true;
  public selectedDataset: string;
  public currentConfig: ConfigFile | null = null;
  public progressBarMax: number = 0; // Dynamic value based on dataset
  public isLimitationsCollapsed = false;
  public filteredData: any[] = []; // Data for AG grid and other calcs
  public displayMode: 'bar' | 'percent' | 'pie' = 'bar'; // Default display mode
  public filterMap: any[] = []; // Current filter map for the data-filters component
  public filterMapDict = CONST.filterMapDict; // for building the data-filters component
  public validDatasets = CONST.validDatasets; // List of valid datasets for the dropdown
  public filterMapType = 'covid';
  public chartsConfig: any[] = []; // Empty initially
  public columnDefs: ColDef[] = [];
  public pageName: string = 'PPRL Data Enhancement Overview';
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

  public selectedFilters: SelectedFilters = CONST.selectedFilters(); // state for storing selected filters
  private fullPatientData: any;

  private titleService = inject(Title);
  private http = inject(HttpClient);
  private manager = inject(PprlEnrichmentManager);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private siteMapApi = inject(SitemapApiService);
  private config = inject(API_URLS) as unknown as Endpoints;

  private baseUrl: string = this.config.n3cUrls.baseUrl + this.config.n3cUrls.dashboard;

  constructor() {
    this.titleService.setTitle('N3C Dashboard - PPRL Enrichment');
    this.selectedDataset = 'home';
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const datasetParam = params.get('id');
      if (datasetParam && this.validDatasets().includes(datasetParam)) {
        this.selectedDataset = datasetParam;
      } else {
        this.router.navigate(['../home'], {relativeTo: this.route}); // Fallback to default if no param
      }
      this.dataLoading = true;

      // Dynamically import the config file for the dataset from route param
      import(`./page-config/${this.selectedDataset}.json`)
        .then((config: ConfigFile) => {
          this.pageName = config.pageName;
          this.currentConfig = config;
          this.loadPatientData(config);
        })
        .catch((error) => {
          this.showError = true;
          console.error(`Failed to load default configuration: ${this.selectedDataset}`, error);
        });
    });
  }

  private loadPatientData(config: ConfigFile): void {
    const mainData$ = this.http.get<any>(`${this.baseUrl}/pprl/${config.dataFactor}/${config.supplSource}`);
    const datasetKpi$ = this.http.get<KpiResult>(`${this.baseUrl}/pprl/kpi/${config.supplSource}`);
    const parentKpi$ = this.siteMapApi.getFactSheet();
    forkJoin([mainData$, parentKpi$, datasetKpi$]).subscribe({
      next: ([mainData, parentKpi, datasetKpi]) => {
        const allData = mainData.rows;

        this.fullPatientData = allData;
        this.filteredData = this.fullPatientData;

        // Calculate the max value for top kpi panel progress bar so can get a percent when we filter
        this.progressBarMax = allData
          .filter((item: any) => !isNaN(Number(item.patient_count))) // Keep only valid numbers
          .reduce((sum: number, item: any) => sum + Number(item.patient_count), 0);

        // Set stats (state) for specific sections in the top kpi panels
        const pageKpiStats = this.getDatasetKpi(datasetKpi, config.dataFactor);
        this.manager.setKPIStatState('numTPIE', parentKpi.person_rows, 'M', 1);
        this.manager.setKPIStatState('numTMLPE', pageKpiStats.enclaveTotal, 'K', 1);

        // Calculate totals object for charts and kpis used later to construct configs
        const progBarDecimalPlcs = 2;
        const totals = this.manager.calculateTotals(this.fullPatientData, progBarDecimalPlcs);

        // Initialize KPI configs (from state) used in template to build top kpi panel
        this.kpiConfigs = this.manager.updateKpiConfigs(this.currentConfig!)!;

        // Initialize charts config used in buildng the charts
        this.chartsConfig = this.manager.initializeChartsConfig(totals, this.currentConfig!)!;

        // Set config for building the left hand filters
        this.filterMap = this.setFilterMap(config.dataFactor);

        this.dataLoading = false;
        this.isLoading = false;

        // Set column defs for ag grid
        this.updateColumnDefs();
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.showError = true;
        this.dataLoading = false;
      }
    });
  }

  private getDatasetKpi(datasetKpi: KpiResult, datasetType: string): KpiPageStats {
    let countInType;
    if (datasetType === 'covid') {
      countInType = datasetKpi.covid_count;
    } else {
      countInType = datasetKpi.demographic_count;
    }
    return {
      countInType,
      enclaveTotal: datasetKpi.enclave_total
    };
  }

  // Select list options are composed of datasets with either demo or covid realted data
  // This swaps the object that the left hand filters map depending on those two types
  private setFilterMap(filterType: string) {
    this.filterMapType = filterType ?? null;
    if (!filterType) {
      return [];
    }
    // select the filtermap based on the type which was retrieved from the config file
    return this.filterMapDict()[filterType];
  }

  // On select list option change, reload the page with the new dataset via route param
  public onSelectDataset(event: Event): void {
    const dataset = (event.target as HTMLSelectElement).value;
    this.router.navigate(['../', dataset], {relativeTo: this.route});
  }

  // This is output param from the data-filters and it gaurantees all filters are initialzed
  // then applies the filters from left hand filters to dataset.
  public updateFilters(selectedFilters: {[key: string]: string[]}) {
    this.selectedFilters = {
      age: selectedFilters['Age'] || [],
      sex: selectedFilters['Sex'] || [],
      race: selectedFilters['Race'] || [],
      severity: selectedFilters['Severity'] || [],
      ethnicity: selectedFilters['Ethnicity'] || [],
      covidstatus: selectedFilters['COVID Status'] || [],
      longcovidstatus: selectedFilters['Long COVID Status'] || [],
      vaccinationstatus: selectedFilters['Vaccination Status'] || [],
      mortalitystatus: selectedFilters['Mortality Status'] || []
    };

    this.applyFilters();
  }

  // Filter data based on the selected filters and update the page
  private applyFilters() {
    // Filter the data based on selected filters
    this.filteredData = this.manager.filterDataBasedOnSelectedFilters(this.fullPatientData, this.selectedFilters);

    // Recalculate totals and KPIs values with the filtered data
    const progBarDecimalPlcs = 2; // Location in the top kpi panel for progress bar updates
    const totals = this.manager.calculateTotals(this.filteredData, progBarDecimalPlcs);

    const filteredCount = this.filteredData
      .filter((item: any) => !isNaN(Number(item.patient_count))) // Keep only valid numbers
      .reduce((sum: number, item: any) => sum + Number(item.patient_count), 0);

    // First, update KPI configs for top KPI panel
    const newKpiConfigs = this.manager.updateKpiConfigs(this.currentConfig!)!;

    // Then update the KPI progress bar (ensure it uses updated filteredCount), re
    const indexProgBarInKpiPanel = 2; // Location in the top kpi panel for progress bar updates
    this.kpiConfigs = this.manager.updateKpiProgressBar(
      newKpiConfigs,
      filteredCount,
      this.progressBarMax,
      indexProgBarInKpiPanel
    );

    // Finally, refresh all charts
    this.chartsConfig = this.manager.initializeChartsConfig(totals, this.currentConfig!);
  }

  // For clicking to change display above the filters
  public setDisplayMode(mode: 'bar' | 'percent' | 'pie'): void {
    this.displayMode = mode; // Update the main display mode

    this.manager.displayMode = mode; // Update the manager's display mode to persist for filters

    // Update each chart's displayMode in the chartsConfig array
    this.chartsConfig.forEach((chart) => {
      chart.displayMode = mode;
      chart.title = chart.titleMap?.[mode] || chart.title;
    });
  }

  // For generating images of visualizations
  public saveAs(format: string, vizId: string) {
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

  // For ag grid
  private updateColumnDefs(): void {
    if (!this.filteredData || this.filteredData.length === 0) {
      console.warn('No filtered data available to determine column definitions.');
      return;
    }

    const demoColumnDefs = [
      {field: 'race', headerName: 'Race', flex: 10, sortable: true, filter: 'agTextColumnFilter', resizable: true},
      {field: 'ethnicity', headerName: 'Ethnicity', flex: 3, filter: 'agTextColumnFilter', resizable: true},
      {field: 'age', headerName: 'Age', flex: 3, filter: 'agTextColumnFilter', resizable: true},
      {field: 'sex', headerName: 'Sex', flex: 3, filter: 'agTextColumnFilter', resizable: true},
      {field: 'patient_count', headerName: 'Patient Count', width: 120, filter: 'agTextColumnFilter', resizable: true}
    ];

    let covidColumnDefs = [
      {field: 'race', headerName: 'Race', flex: 10, sortable: true, filter: 'agTextColumnFilter', resizable: true},
      {field: 'severity', headerName: 'Severity', flex: 2, filter: 'agTextColumnFilter', resizable: true},
      {
        field: 'long_covid',
        headerName: 'Long COVID Status',
        flex: 3,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {field: 'mortality', headerName: 'Mortality', width: 120, filter: 'agTextColumnFilter', resizable: true},
      {
        field: 'vaccinated',
        headerName: 'Vaccination Status',
        flex: 3,
        filter: 'agTextColumnFilter',
        resizable: true
      },
      {field: 'patient_count', headerName: 'Patient Count', flex: 3, filter: 'agTextColumnFilter', resizable: true}
    ];
    if (this.selectedDataset === 'mortality_covid') {
      covidColumnDefs = covidColumnDefs.filter((col) => col.field !== 'mortality'); // Remove mortality for mortality_covid
    }

    this.columnDefs = this.filterMapType === 'demographics' ? demoColumnDefs : covidColumnDefs;
  }

  updateFiltersForCharts(selected: {label: string; groupName: string}): void {
    this.selectedFilters = this.manager.toggleChartFilter<SelectedFilters>(this.selectedFilters, selected);
    this.applyFilters();
  }
}
