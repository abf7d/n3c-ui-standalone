import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule, Router, ActivatedRoute} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {toPng, toJpeg, toSvg} from 'html-to-image';
import {saveAs} from 'file-saver';
import {GridComponent} from '../../shared/data-grid/data-grid.component';
import {RenderChartComponent} from '../../shared/render-chart/render-chart.component';
import {DomSanitizer} from '@angular/platform-browser';
import {KpiStatsApiService} from '../../../services/api/kpi-stats-api/kpi-stats-api.service';
import {RelatedDashboardsComponent} from '../../shared/related-dashboards/related-dashboards.component';
import {SearchDashboardsComponent} from '../../shared/search-dashboards/search-dashboards.component';
import {DataFiltersComponent} from '../../shared/data-filters/data-filters.component';
import {KpiColumnConfig, KpiPanelConfig} from '../../shared/kpi-panel/kpi-panel.interface';
import {KpiPanelComponent} from '../../shared/kpi-panel/kpi-panel.component';
import paxlovid1Config from './paxlovid_1.config.json';
import paxlovid2Config from './paxlovid_2.config.json';
import paxlovid3Config from './paxlovid_3.config.json';
import paxlovid4Config from './paxlovid_4.config.json';
import paxlovid5Config from './paxlovid_5.config.json';
import paxlovid6Config from './paxlovid_6.config.json';
import paxlovid7Config from './paxlovid_7.config.json';
import paxlovid8Config from './paxlovid_8.config.json';
import paxlovid9Config from './paxlovid_9.config.json';
import paxlovid10Config from './paxlovid_10.config.json';
import {PaxlovidService} from './paxlovid-service/paxlovid.service';
import {TitleMap, PatientRecord, ConfigFile} from './models/paxlovid.models'; // Adjust the paths as needed
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';

@Component({
  selector: 'app-paxlovid',
  templateUrl: './paxlovid.component.html',
  styleUrls: ['./paxlovid.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatExpansionModule,
    GridComponent,
    RenderChartComponent,
    RelatedDashboardsComponent,
    SearchDashboardsComponent,
    DataFiltersComponent,
    KpiPanelComponent,
    HeaderViewComponent
  ]
})
export class PaxlovidComponent implements OnInit, AfterViewInit {
  @ViewChild(RelatedDashboardsComponent) relatedDashboardsComponent!: RelatedDashboardsComponent;

  relatedDashboardIds = ['Medications_Snapshots', 'Medications', 'Medication_Time_Series'];

  public showError = false;
  public kpiConfigs: KpiPanelConfig = [];
  public isLoading: boolean = true;
  public selectedDataset: string;
  public currentConfig: ConfigFile | null = null;
  public originalTotalCount: number = 0; // Dynamic value based on dataset
  public filteredCount: number = 0; // Tracks filtered count for the progress bar
  public defaultDataset: string = 'paxlovid_4';
  public datasetConfig: any;
  public isFiltersDisabled = false;
  public filteredDashboardTiles: any[] = [];
  public pageFilterConfig = {
    default: ['age', 'ethnicity', 'sex', 'race', 'severity', 'paxlovidstatus'],
    paxlovidOnly: ['paxlovidstatus']
  };
  public activeFilters: string[] = [];
  titleMap: Record<string, string> = {};

  private titleService = inject(Title);
  private http = inject(HttpClient);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private sanitizer = inject(DomSanitizer);
  private KpiStatsApi = inject(KpiStatsApiService);
  private cdr = inject(ChangeDetectorRef);
  private paxlovidService = inject(PaxlovidService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.titleService.setTitle('N3C Frequently Asked Questions');
    this.selectedDataset = 'paxlovid_1';
  }

  popoverContents = [
    {
      title: 'Total Patients in the N3C Data Enclave',
      content: `<p>Total Number of Individual Persons within the N3C Data Enclave</p>`
    },
    {
      title: 'Total Patients Prescribed Metformin in View',
      content: `<p>Total Number of Individuals within the view who have Metformin indicated in their EHR.</p>
                <p>Sample: All N3C Patients.</p>
										<small class='kpi-small-note'>Even without filters, this total may be less than the total number of patients prescribed Metformin within the Enclave due to the suppression of counts less than 20.</small>
      `
    },
    {
      title: 'Total COVID+ Patients in View',
      content: `
        <strong>COVID+ Defined As:</strong>
        <ul class='low-padding-list'>
          <li>Laboratory-confirmed positive COVID-19 PCR or Antigen test</li>
          <li>(or) Laboratory-confirmed positive COVID-19 Antibody test</li>
          <li>(or) Medical visit in which the ICD-10 code for COVID-19 (U07.1) was recorded</li>
        </ul>
      `
    },
    {
      title: 'Total Long COVID Patients in View',
      content: `<p><strong>Long COVID Defined As:</strong> any patient having the ICD-10 code for PASC (U09.9) within their EHR.</p>
										<small class='kpi-small-note'>Note: The ICD-10 for PASC (U09.9) was not created until October 1, 2021, and any data using this code will be
										limited to after this date.</small>
      `
    },
    {
      title: 'Total Vaccinated Patients in View',
      content: `<strong>Vaccination Defined As:</strong> any patient having at least one dose of Pfizer, Moderna,
										or Johnson &amp; Johnson COVID-19 vaccines within their EHR.
      `
    },
    {
      title: 'Total Mortalities in View',
      content: `<strong>Mortality Defined As:</strong>
										<ul class='low-padding-list'>
											<li>Any patient with a date of death in the Enclave</li>
											<li>(or) Any patient from a mortality-linked PPRL site who exists in one
											of the external sources (ex., Government data with death certificates, ObituaryData.com, and obituary data from private sources)</li>
										</ul>
										<small class='kpi-small-note'>Note: this metric is distinct from the Mortality category associated with Severity,
										as it does not limit deaths to only those suspected to be caused by COVID-19.</small>
      `
    }
    // Add more items for each popover as needed
  ];

  getPopoverContent(index: number): string {
    // Safely sanitize the HTML content
    return this.sanitizer.bypassSecurityTrustHtml(this.popoverContents[index].content) as string;
  }

  getPopoverContentString(index: number): string {
    return this.popoverContents[index].content; // Access the content property directly
  }

  getPopoverTitle(index: number): string {
    return this.popoverContents[index]?.title || '';
  }

  // Define the collapse properties
  isAgeCollapsed = false;
  isEthnicityCollapsed = false;
  isRaceCollapsed = false;
  isSexCollapsed = false;
  isCovidStatusCollapsed = false;
  isLongCovidStatusCollapsed = false;
  isMetforminCollapsed = false;
  isMedicationOccurrenceCollapsed = false;
  isMortalityCollapsed = false;
  isSeverityCollapsed = false;
  isVaccinationCollapsed = false;
  isLimitationsCollapsed = false;

  // Define other properties and data
  filteredData: any[] = []; // This will store the filtered data

  paxlovidData: any;
  paxlovidAgeTotals: any;
  paxlovidSexTotals: any;
  paxlovidRaceTotals: any;
  paxlovidSeverityTotals: any;
  paxlovidEthnicityTotals: any;
  paxlovidMedOccurrenceTotals: any;
  paxlovidCovidStatusTotals: any;
  paxlovidStatusTotals: any;
  paxlovidDaysTotals: any;
  paxlovidLongCovidStatusTotals: any;
  paxlovidVaccinationStatusTotals: any;
  mortalityTotals: any; // this is for  paxlovid_1 and _5

  // Severity breakdown totals
  nonMetforminSeverityTotals: any = {};
  diabeticMetforminSeverityTotals: any = {};
  diabeticNonMetforminSeverityTotals: any = {};
  nonDiabeticMetforminSeverityTotals: any = {};
  nonDiabeticNonMetforminSeverityTotals: any = {};
  // Long Covid breakdown totals
  nonMetforminLongCovidTotals: any = {}; // Patients not prescribed Metformin
  paxlovidLongCovidTotals: any = {}; // Patients prescribed Metformin
  diabeticNonMetforminLongCovidTotals: any = {}; // Diabetic patients not prescribed Metformin
  diabeticMetforminLongCovidTotals: any = {}; // Diabetic patients prescribed Metformin
  nonDiabeticNonMetforminLongCovidTotals: any = {}; // Non-diabetic patients not prescribed Metformin
  nonDiabeticMetforminLongCovidTotals: any = {}; // Non-diabetic patients prescribed Metformin
  // Mortality totals
  nonMetforminMortalityTotals: any = {};
  metforminMortalityTotals: any = {};
  diabeticNonMetforminMortalityTotals: any = {};
  diabeticMetforminMortalityTotals: any = {};
  nonDiabeticNonMetforminMortalityTotals: any = {};
  nonDiabeticMetforminMortalityTotals: any = {};

  displayMode: 'bar' | 'percent' | 'pie' = 'bar'; // Default display mode

  filterMap = [
    [
      {
        title: 'Age',
        values: ['<18', '18-64', '65+', 'Unknown']
      },
      {
        title: 'Ethnicity',
        values: ['Hispanic or Latino', 'Not Hispanic or Latino', 'Unknown']
      },
      {
        title: 'Race',
        values: [
          'White',
          'Black or African American', // Update this value to match the actual data
          'Asian',
          'American Indian or Alaska Native',
          'Native Hawaiian or Other Pacific Islander',
          'Other',
          'Unknown'
        ]
      },
      {
        title: 'Sex',
        values: ['Female', 'Male', 'Unknown']
      }
    ],
    [
      {
        title: 'Severity',
        values: ['Mild', 'Mild in ED', 'Moderate', 'Severe', 'Mortality', 'Unavailable']
      },
      {
        title: 'Paxlovid Status',
        values: ['Paxlovid', 'No Paxlovid']
      }

      // {
      //   title: 'Long COVID Status',
      //   values: ['Long COVID', 'Unknown']
      // },
      // {
      //   title: 'Metformin Occurrence',
      //   values: ['After COVID', 'Before COVID','Unknown or N/A']
      // },
      // {
      //   title: 'Mortality Status',
      //   values: ['Mortality', 'No Mortality']
      // },
      // {
      //   title: 'Vaccination Status',
      //   values: ['Vaccinated', 'Unknown']
      // }
    ]
  ];

  selectedFilters: {
    age: string[];
    sex: string[];
    race: string[];
    severity: string[];
    ethnicity: string[];
    //medoccurrence: string[];
    paxlovidstatus: string[];
    // covidstatus: string[];
    // longcovidstatus: string[];
    // vaccinationstatus: string[];
    // mortality: string[];
    // cciscore: string[];
  } = {
    age: [],
    sex: [],
    race: [],
    severity: [],
    ethnicity: [],
    //medoccurrence: [],
    paxlovidstatus: []
    // covidstatus: [],
    // longcovidstatus: [],
    // vaccinationstatus: [],
    // mortality: [],
    // cciscore: []
  };

  allRecords: PatientRecord[] = []; // This will contain the full dataset
  filteredRecords: PatientRecord[] = []; // This will contain the filtered dataset

  chartsConfig: any[] = []; // Empty initially
  columnDefs: any[] = [];
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

  ngOnInit(): void {
    // The approach below reuses the onDatasetChange code for the initial page load
    // and reduces code duplication.
    // ----------------------------------
    // Manually create a synthetic event to simulate the dropdown change
    const defaultDataset = 'paxlovid_4';
    this.router.navigate(['dashboard', 'public-health', 'paxlovid', '4']);
    const event = {
      target: {value: defaultDataset}
    } as unknown as Event;

    if (this.defaultDataset === 'paxlovid_9') {
      this.activeFilters = this.pageFilterConfig.paxlovidOnly;
    } else {
      this.activeFilters = this.pageFilterConfig.default;
    }

    // Call the onDatasetChange method with the synthetic event
    this.onDatasetChange(event);

    // Initialize selectedFilters with only the active filters
    this.selectedFilters = this.activeFilters.reduce(
      (filters, filterKey) => {
        return {
          ...filters,
          [filterKey]: [] as string[] // Ensure correct type for each filter
        };
      },
      {} as Record<keyof typeof this.selectedFilters, string[]>
    ); // Ensure the final object matches the expected type
  }

  ngAfterViewInit(): void {
    // Ensuring view children are fully initialized.
    setTimeout(() => {}, 500); // A slight delay can sometimes help.
  }

  getTitleForChart(key: keyof TitleMap, mode: 'bar' | 'percent' | 'pie'): string {
    return this.currentConfig?.titleMap[key]?.[mode] ?? 'Title Not Found';
  }

  private updateColumnDefs(): void {
    if (!this.filteredData || this.filteredData.length === 0) {
      console.warn('No filtered data available to determine column definitions.');
      return;
    }

    // Set MAIN column definitions for the grid - these dont change

    // customize for certain datasets
    if (this.selectedDataset === 'paxlovid_5') {
      this.columnDefs = [
        {
          field: 'vaccination_doses',
          headerName: 'Vaccination Doses',
          width: 320,
          filter: 'agTextColumnFilter',
          resizable: true
        },
        {field: 'patient_count', headerName: 'Patient Count', width: 160, filter: 'agTextColumnFilter', resizable: true}
      ];
    } else {
      this.columnDefs = [
        {field: 'race', headerName: 'Race', width: 220, sortable: true, filter: 'agTextColumnFilter', resizable: true},
        {field: 'ethnicity', headerName: 'Ethnicity', width: 180, filter: 'agTextColumnFilter', resizable: true},
        {field: 'age', headerName: 'Age', width: 80, filter: 'agTextColumnFilter', resizable: true},
        {field: 'sex', headerName: 'Sex', width: 80, filter: 'agTextColumnFilter', resizable: true},
        {field: 'severity', headerName: 'Severity', width: 120, filter: 'agTextColumnFilter', resizable: true},
        // { field: 'covid_status', headerName: 'COVID Status', width: 120, filter: 'agTextColumnFilter', resizable: true },
        // { field: 'long_covid_status', headerName: 'Long COVID Status', width: 120, filter: 'agTextColumnFilter', resizable: true },
        // { field: 'vaccination_status', headerName: 'Vaccination Status', width: 120, filter: 'agTextColumnFilter', resizable: true },
        // { field: 'mortality', headerName: 'Mortality', width: 120, filter: 'agTextColumnFilter', resizable: true },
        // { field: 'metformin_occurrence', headerName: 'Metformin Occurrence', width: 150, filter: 'agTextColumnFilter', resizable: true },
        {field: 'patient_count', headerName: 'Patient Count', width: 120, filter: 'agTextColumnFilter', resizable: true}
      ];
    }

    // Dynamically add 'paxlovid_status' column if it exists in the dataset
    if ('paxlovid_status' in this.filteredData[0]) {
      this.columnDefs.unshift({
        // make it 1st column
        field: 'paxlovid_status',
        headerName: 'Paxlovid Status',
        width: 150,
        filter: 'agTextColumnFilter',
        resizable: true
      });

      // Remove 'ethnicity' column if 'paxlovid_status' exists
      //this.columnDefs = this.columnDefs.filter((col) => col.field !== 'ethnicity');
    }
  }

  updateFilterMap(changedFilter: Record<string, string>): void {
    // Get all valid keys from selectedFilters
    const validFilterKeys = Object.keys(this.selectedFilters) as (keyof typeof this.selectedFilters)[];

    Object.entries(changedFilter).forEach(([key, value]) => {
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '') as keyof typeof this.selectedFilters;

      if (validFilterKeys.includes(normalizedKey)) {
        if (Array.isArray(this.selectedFilters[normalizedKey])) {
          if (value) {
            this.selectedFilters[normalizedKey] = [value]; // Set the filter value
          } else {
            this.selectedFilters[normalizedKey] = []; // Clear filter if value is empty
          }
        }
      } else {
        console.error('Invalid filter data:', key, value);
      }
    });

    // Trigger UI update or re-fetch data as needed
    this.applyFilters();
  }

  private updateKpiConfigs(): void {
    if (!this.currentConfig || !this.currentConfig.kpiPanelConfig) {
      console.error('KPI panel configuration is missing from the current dataset configuration.');
      return;
    }

    // Map the kpiPanelConfig from the dataset configuration to the kpiConfigs
    const newConfigs = this.currentConfig.kpiPanelConfig.map((column) => {
      // iterate over column items
      const items = column.items.map((item) => {
        const valueKey = item.value as keyof PaxlovidComponent;

        return {
          title: item.title,
          value: this[valueKey] || '', // Dynamically resolve the value property
          icon: item.icon,
          tooltipTitle: item.tooltipTitle,
          tooltipContent: item.tooltipContent,
          footer: item.footer || '',
          limitationsLink: item.limitationsLink || '',
          progress: item.progress || null // Optional progress for section 2
        };
      });

      return {
        separator: column.separator,
        items,
        rows: column.rows
      } as KpiColumnConfig;
    });

    this.kpiConfigs = [...newConfigs];

    // Trigger change detection manually if needed
    this.cdr.detectChanges();
  }

  toggleCollapse(panelId: string) {
    switch (panelId) {
      // the filter panels toggle are in the filter component now
      case 'paxlovid_5limitations_body':
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

    this.datasetConfig = this.getDatasetConfig(dataset);
    if (!this.datasetConfig) {
      console.error(`Dataset configuration not found for: ${dataset}`);
      return;
    }

    this.selectedDataset = dataset;
    this.isLoading = true;

    const datasetNumber = dataset.split('_')[1];
    this.router.navigate(['dashboard', 'public-health', 'paxlovid', datasetNumber]);

    import(`./${dataset}.config.json`)
      .then((config) => {
        this.currentConfig = config;

        if (!this.currentConfig?.kpiPanelConfig) {
          console.error('KPI panel configuration is missing from the current dataset configuration.');
          return;
        }

        this.loadDataForDataset(this.datasetConfig.apiEndpoint)
          .then(() => {
            this.paxlovidService.initializeChartsConfigService(
              this.datasetConfig!,
              this.displayMode,
              this.prepareTotalsData()
            );

            this.updateKpiConfigs();
            this.filteredCount = this.originalTotalCount;

            const updatedConfigs = this.paxlovidService.updateKpiProgressBarService(
              this.filteredCount,
              this.originalTotalCount,
              this.kpiConfigs
            );

            this.kpiConfigs = updatedConfigs;

            this.updateColumnDefs();

            this.titleMap = this.filterMap.flat().reduce(
              (map, filter) => {
                map[filter.title.toLowerCase().replace(/\s+/g, '')] = filter.title;
                return map;
              },
              {} as Record<string, string>
            );

            if (['paxlovid_6', 'paxlovid_9', 'paxlovid_10', 'paxlovid_11'].includes(dataset)) {
              this.disableAllFilters();
              this.filterMap = [];
              this.selectedFilters = {
                age: [],
                sex: [],
                race: [],
                severity: [],
                ethnicity: [],
                paxlovidstatus: []
              };
            } else if (['paxlovid_5', 'paxlovid_7'].includes(dataset)) {
              this.isFiltersDisabled = false;
              this.filterMap = [
                [
                  {
                    title: 'Paxlovid Status',
                    values: ['Paxlovid', 'No Paxlovid']
                  }
                ]
              ];
              this.selectedFilters = {
                age: [],
                sex: [],
                race: [],
                severity: [],
                ethnicity: [],
                paxlovidstatus: []
              };
            } else {
              this.isFiltersDisabled = false;
              this.filterMap = [
                [
                  {title: 'Age', values: ['<18', '18-64', '65+', 'Unknown']},
                  {title: 'Ethnicity', values: ['Hispanic or Latino', 'Not Hispanic or Latino', 'Unknown']},
                  {title: 'Race', values: ['White', 'Black or African American', 'Asian', 'Other', 'Unknown']},
                  {title: 'Sex', values: ['Female', 'Male', 'Unknown']}
                ],
                [
                  {title: 'Severity', values: ['Mild', 'Moderate', 'Severe', 'Unavailable']},
                  {title: 'Paxlovid Status', values: ['Paxlovid', 'No Paxlovid']}
                ]
              ];
              this.selectedFilters = this.filterMap.flat().reduce(
                (filters, filter) => {
                  filters[filter.title.toLowerCase().replace(/\s+/g, '') as keyof typeof this.selectedFilters] = [];
                  return filters;
                },
                {
                  age: [],
                  sex: [],
                  race: [],
                  severity: [],
                  ethnicity: [],
                  paxlovidstatus: []
                }
              );
            }

            this.cdr.detectChanges();
          })
          .catch((error) => {
            console.error(`Failed to fetch data for dataset: ${dataset}`, error);
          });
      })
      .catch((error) => {
        console.error(`Failed to load configuration for dataset: ${dataset}`, error);
        this.isLoading = false;
        this.cdr.detectChanges();
      })
      .finally(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      });
  }

  // Helper to initialize empty filters
  private initializeEmptyFilters(): Record<keyof typeof this.selectedFilters, string[]> {
    return {
      age: [],
      sex: [],
      race: [],
      severity: [],
      ethnicity: [],
      paxlovidstatus: []
    };
  }

  getDatasetConfig(dataset: string): ConfigFile | null {
    // Hardcoded API endpoints and chartIdPrefix
    const hardcodedConfigs: {[key: string]: {apiEndpoint: string; chartIdPrefix: string}} = {
      // 1,2,3 have 3 different data sets on each page
      // paxlovid_1: {
      //     apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/smsc-xrgb.json?',
      //     chartIdPrefix: 'paxlovid_1',
      // },
      // paxlovid_2: {
      //     apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/exda-rdzd.json?',
      //     chartIdPrefix: 'paxlovid_2',
      // },
      // paxlovid_3: {
      //     apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/7ap8-hub7.json?',
      //     chartIdPrefix: 'paxlovid_3',
      // },
      paxlovid_4: {
        //TT 1/2/25
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/e56r-ej4m.json?',
        chartIdPrefix: 'paxlovid_4'
      },
      paxlovid_5: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/a2t7-b4rc.json?',
        chartIdPrefix: 'paxlovid_5'
      },
      paxlovid_6: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/5wqk-ips4.json?',
        chartIdPrefix: 'paxlovid_6'
      },
      paxlovid_7: {
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/b2b3-mj4w.json?',
        chartIdPrefix: 'paxlovid_7'
      },
      // there is no data set on the extract page for paxlovid_8
      // paxlovid_8: {
      //   apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/i5jg-tdu3.json?',
      //   chartIdPrefix: 'paxlovid_8',
      // },
      paxlovid_9: {
        //TT 1/7/25
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/r9r4-95fb.json?',
        chartIdPrefix: 'paxlovid_9'
      },
      paxlovid_10: {
        //TT 1/7/25
        apiEndpoint: 'https://axleinformatics.demo.socrata.com/resource/p2bv-ffun.json?',
        chartIdPrefix: 'paxlovid_10'
      }
    };

    // Import JSON configs
    const jsonConfigs: {[key: string]: Partial<ConfigFile>} = {
      paxlovid_1: paxlovid1Config,
      paxlovid_2: paxlovid2Config,
      paxlovid_3: paxlovid3Config,
      paxlovid_4: paxlovid4Config,
      paxlovid_5: paxlovid5Config,
      paxlovid_6: paxlovid6Config,
      paxlovid_7: paxlovid7Config,
      paxlovid_8: paxlovid8Config,
      paxlovid_9: paxlovid9Config,
      paxlovid_10: paxlovid10Config
    };

    // Get the hardcoded and JSON configs for the selected dataset
    const hardcodedConfig = hardcodedConfigs[dataset];
    const jsonConfig = jsonConfigs[dataset];

    if (!hardcodedConfig || !jsonConfig) {
      console.error(`Configuration not found for dataset: ${dataset}`);
      return null;
    }

    // Merge the hardcoded config with the JSON config directly
    return {
      ...hardcodedConfig,
      ...jsonConfig // Flatten the structure, avoiding a nested "config" property
    } as ConfigFile;
  }

  updateChartIds(prefix: string): void {
    this.chartsConfig.forEach((chart) => {
      chart.id = `${prefix}-${chart.id.split('-')[1]}`;
    });
  }

  updateTotals(totals: any): void {
    this.paxlovidService.updateTotalsService(totals);
  }

  loadDataForDataset(apiEndpoint: string): Promise<void> {
    const limit = 1000;

    return new Promise<void>((resolve, reject) => {
      // Ensure reject is defined here
      this.http.get<{count: string}[]>(`${apiEndpoint}$select=count(*)`).subscribe({
        next: (result) => {
          const totalRecords = parseInt(result[0].count, 10);
          const requests$ = [];
          for (let offset = 0; offset < totalRecords; offset += limit) {
            const url = `${apiEndpoint}$limit=${limit}&$offset=${offset}`;
            requests$.push(this.http.get<any[]>(url));
          }

          const kpistats$ = this.KpiStatsApi.getEnclaveMetrics();
          const kpifacts$ = this.KpiStatsApi.getFactSheet();

          forkJoin([...requests$, kpistats$, kpifacts$]).subscribe({
            next: (responses) => {
              const kpifacts = responses.pop();
              const kpistats = responses.pop();
              const allData = responses.flat();
              this.paxlovidData = allData;
              this.filteredData = this.paxlovidData;

              // Need Original Total Loaded Count for Progress bar - Calculate total count of patients by summing "count" values
              this.originalTotalCount = this.filteredData.reduce((sum, record) => {
                const patientCount = parseInt(record.patient_count, 10) || 0; // Ensure it's a number
                return sum + (patientCount >= 20 ? patientCount : 0); // Skip "<20" or invalid counts
              }, 0);

              // Calculate totals dynamically
              const totalsData = this.paxlovidService.calculateTotalsService(this.paxlovidData, this);
              this.updateTotals(totalsData);

              // Initialize charts
              this.chartsConfig = this.paxlovidService.initializeChartsConfigService(
                this.datasetConfig!,
                this.displayMode,
                totalsData
              );

              // Set KPI stats
              this.paxlovidService.setKPIStatService(this, 'numTPIE', kpistats['person_rows']['value'], 'M', 2);
              this.paxlovidService.setKPIStatService(this, 'numTCPIE', kpifacts['covid_positive_patients'], 'M', 2);
              // cannot find the data source for Paxlovid Patients in Enclave (TT)
              this.paxlovidService.setKPIStatService(this, 'numPPIE', 475758, 'K', 2);

              // Adjust this section to iterate over active filters, not data records
              if (this.activeFilters) {
                const changedFilters: Record<string, string> = this.activeFilters.reduce(
                  (acc, filterKey) => {
                    const normalizedKey = filterKey.toLowerCase().replace(/\s+/g, '');
                    const selectedValues = this.selectedFilters[normalizedKey as keyof typeof this.selectedFilters];

                    if (selectedValues && selectedValues.length > 0) {
                      acc[filterKey] = selectedValues[0]; // Take the first selected value
                    }
                    return acc;
                  },
                  {} as Record<string, string>
                );

                if (Object.keys(changedFilters).length > 0) {
                  this.updateFilterMap(changedFilters); // Call with the correct structure
                } else {
                  console.error('No active filters with selected values');
                }
              } else {
                console.error('No active filters available');
              }

              this.updateColumnDefs();

              resolve();
            },
            error: (error) => {
              console.error('Error loading dataset data:', error);
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

  disableAllFilters(): void {
    this.isFiltersDisabled = true;
    // Clear filter state
    this.selectedFilters = {
      age: [],
      ethnicity: [],
      sex: [],
      race: [],
      severity: [],
      paxlovidstatus: []
    };

    this.applyFilters();
  }

  updateFilters(selectedFilters: {[key: string]: string[]}) {
    // Update selected filters
    this.selectedFilters = {
      age: selectedFilters['Age'] || [],
      ethnicity: selectedFilters['Ethnicity'] || [],
      sex: selectedFilters['Sex'] || [],
      race: selectedFilters['Race'] || [],
      severity: selectedFilters['Severity'] || [],
      paxlovidstatus: selectedFilters['Paxlovid Status'] || []
      // medoccurrence: selectedFilters['Medication Occurrence'] || [],
      // covidstatus: selectedFilters['COVID Status'] || [],
      // longcovidstatus: selectedFilters['Long COVID Status'] || [],
      // vaccinationstatus: selectedFilters['Vaccination Status'] || [],
      // mortality: selectedFilters['Mortality Status'] || [],
      // cciscore: selectedFilters['CCI Score'] || [],
    };

    // Apply filters
    this.applyFilters();
  }

  // This method will filter data based on the selected filters
  filterDataBasedOnSelectedFilters() {
    return this.paxlovidData.filter((item: PatientRecord) => {
      const ageFilter = this.selectedFilters.age.length === 0 || this.selectedFilters.age.includes(item.age);
      const sexFilter = this.selectedFilters.sex.length === 0 || this.selectedFilters.sex.includes(item.sex);
      const raceFilter = this.selectedFilters.race.length === 0 || this.selectedFilters.race.includes(item.race);
      const severityFilter =
        this.selectedFilters.severity.length === 0 || this.selectedFilters.severity.includes(item.severity);
      const ethnicityFilter =
        this.selectedFilters.ethnicity.length === 0 || this.selectedFilters.ethnicity.includes(item.ethnicity);
      const paxlovidStatusFilter =
        this.selectedFilters.paxlovidstatus.length === 0 ||
        this.selectedFilters.paxlovidstatus.includes(item.paxlovid_status);

      // Return true if all filters match
      return ageFilter && sexFilter && raceFilter && severityFilter && ethnicityFilter && paxlovidStatusFilter;
    });
  }

  applyFilters() {
    // Filter the data based on selected filters
    const filteredData = this.filterDataBasedOnSelectedFilters();
    this.filteredData = filteredData; // Pass this to the grid

    // Recalculate totals and KPIs with the filtered data
    const totals = this.paxlovidService.calculateTotalsService(filteredData, this);
    this.updateTotals(totals);

    this.filteredCount = filteredData
      .filter((item: any) => !isNaN(Number(item.patient_count))) // Keep only valid numbers
      .reduce((sum: number, item: any) => sum + Number(item.patient_count), 0);

    this.paxlovidAgeTotals = totals.ageTotals;
    this.paxlovidSexTotals = totals.sexTotals;
    this.paxlovidRaceTotals = totals.raceTotals;
    this.paxlovidSeverityTotals = totals.metforminSeverityTotals;
    this.paxlovidEthnicityTotals = totals.ethnicityTotals;
    //this.paxlovidMedOccurrenceTotals = totals.medOccurrenceTotals;
    this.paxlovidStatusTotals = totals.paxlovidStatusTotals;
    this.paxlovidDaysTotals = totals.paxlovidDaysTotals;
    // this.paxlovidLongCovidStatusTotals = totals.longCovidStatusTotals;
    // this.paxlovidVaccinationStatusTotals = totals.vaccinationStatusTotals;
    // this.metforminMortalityTotals = totals.mortalityTotals;
    // // Severity Totals
    // this.nonMetforminSeverityTotals = totals.nonMetforminSeverityTotals,
    // this.diabeticNonMetforminSeverityTotals = totals.diabeticNonMetforminSeverityTotals,
    // this.diabeticMetforminSeverityTotals = totals.diabeticMetforminSeverityTotals,
    // this.nonDiabeticNonMetforminSeverityTotals = totals.nonDiabeticNonMetforminSeverityTotals,
    // this.nonDiabeticMetforminSeverityTotals = totals.nonDiabeticMetforminSeverityTotals,
    // // Long COVID Totals
    // this.paxlovidLongCovidTotals = totals.metforminLongCovidTotals,
    // this.nonMetforminLongCovidTotals = totals.nonMetforminLongCovidTotals;
    // this.nonDiabeticMetforminLongCovidTotals = totals.nonDiabeticMetforminLongCovidTotals,
    // this.nonDiabeticNonMetforminLongCovidTotals = totals.nonDiabeticNonMetforminLongCovidTotals,
    // this.diabeticMetforminLongCovidTotals = totals.diabeticMetforminLongCovidTotals,
    // this.diabeticNonMetforminLongCovidTotals = totals.diabeticNonMetforminLongCovidTotals,
    // // Mortality Totals
    // this.metforminMortalityTotals = totals.metforminMortalityTotals;
    // this.nonMetforminMortalityTotals = totals.nonMetforminMortalityTotals;
    // this.nonDiabeticMetforminMortalityTotals = totals.nonDiabeticMetforminMortalityTotals;
    // this.nonDiabeticNonMetforminMortalityTotals = totals.nonDiabeticNonMetforminMortalityTotals;
    // this.diabeticMetforminMortalityTotals = totals.diabeticMetforminMortalityTotals;
    // this.diabeticNonMetforminMortalityTotals = totals.diabeticNonMetforminMortalityTotals;

    // Finally, refresh all charts
    if (this.currentConfig) {
      this.paxlovidService
        .loadAndInitializeChartsService(
          this.currentConfig,
          this.displayMode,
          this.prepareTotalsData(),
          this.selectedDataset
        )
        .then((chartsConfig) => {
          this.chartsConfig = chartsConfig;
          this.updateKpiConfigs();
          const updatedConfigs = this.paxlovidService.updateKpiProgressBarService(
            this.filteredCount,
            this.originalTotalCount,
            this.kpiConfigs
          );
          // Assign the updated configs back to the component variable
          this.kpiConfigs = updatedConfigs;
          // Trigger change detection manually
          this.cdr.detectChanges();

          this.updateColumnDefs();
          this.isLoading = false;
        })
        .catch((error) => {
          console.error('Failed to load and initialize charts', error);
          this.isLoading = false;
        });
    } else {
      console.error('Current config is null');
    }
  }

  setDisplayMode(mode: 'bar' | 'percent' | 'pie'): void {
    this.displayMode = mode; // Update the main display mode

    // Update each chart's displayMode in the chartsConfig array
    this.chartsConfig.forEach((chart) => {
      chart.displayMode = mode;
    });

    // now update the charts
    if (this.currentConfig) {
      this.paxlovidService
        .loadAndInitializeChartsService(
          this.currentConfig,
          this.displayMode,
          this.prepareTotalsData(),
          this.selectedDataset
        )
        .then((chartsConfig) => {
          this.chartsConfig = chartsConfig;
          this.updateKpiConfigs();
          this.updateColumnDefs();
          this.isLoading = false;
        })
        .catch((error) => {
          console.error('Failed to load and initialize charts', error);
          this.isLoading = false;
        });
    } else {
      console.error('Current config is null');
    }
  }

  private prepareTotalsData(): Record<string, any> {
    return this.paxlovidService.getTotalsService();
  }
}
