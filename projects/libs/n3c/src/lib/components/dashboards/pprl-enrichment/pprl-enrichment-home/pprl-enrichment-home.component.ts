import '../../../../ag-grid-setup';
import {CommonModule} from '@angular/common';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {PprlLimitationComponent} from '../pprl-limitation/pprl-limitation.component';
import {PprlEnrichmentApiService} from '@odp/n3c/lib/services/api/pprl-enrichment-api/pprl-enrichment-api.service';
import {forkJoin} from 'rxjs';
import {AgGridAngular} from 'ag-grid-angular';
import {BarCellRendererComponent} from './bar-cell-renderer/bar-cell-renderer.component';
import {PprlBarService} from './pprl-bar.service';
import {toPng, toJpeg} from 'html-to-image';
import {saveAs} from 'file-saver';
import {GridApi} from 'ag-grid-community';
import {HeaderViewComponent} from '../../../shared/header-view/header-view.component';
import {N3cLoaderComponent} from '../../../shared/loader/loader.component';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';

@Component({
  selector: 'app-pprl-enrichment-home',
  imports: [
    CommonModule,
    RouterModule,
    PprlLimitationComponent,
    AgGridAngular,
    HeaderViewComponent,
    N3cLoaderComponent,
    DashboardFooterComponent
  ],
  providers: [PprlBarService],
  templateUrl: './pprl-enrichment-home.component.html',
  styleUrl: './pprl-enrichment-home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PprlEnrichmentHomeComponent implements OnInit {
  public selectedDataset: string;
  public isLimitationsCollapsed = false;
  public frameworkComponents: any;
  @ViewChild('barChart', {static: true}) barChart!: ElementRef;
  public summaryData: any = {
    colors: ['#EADEF7', '#8642CE', '#33298D', '#a6a6a6'],
    data: [],
    displayMode: 'bar',
    labels: [],
    title: ''
  };

  medicareTable: any[] = [];
  medicaidTable: any[] = [];
  mortalityTable: any[] = [];
  viralTable: any[] = [];
  viralFeed: any[] = [];

  medicareColumnDefs: any[] = [];
  medicaidColumnDefs: any[] = [];
  mortalityColumnDefs: any[] = [];
  viralColumnDefs: any[] = [];
  dataLoading = true;
  showError = false;

  viralApi: GridApi | null = null;
  medicareApi: GridApi | null = null;
  medicaidApi: GridApi | null = null;
  mortalityApi: GridApi | null = null;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private api: PprlEnrichmentApiService,
    private chart: PprlBarService
  ) {
    this.titleService.setTitle('N3C Frequently Asked Questions');
    this.selectedDataset = 'home';
  }

  onDatasetChange(event: Event): void {
    const dataset = (event.target as HTMLSelectElement).value;
    this.router.navigate(['../', dataset], {relativeTo: this.route});
  }
  ngOnInit(): void {
    this.frameworkComponents = {
      barCellRenderer: BarCellRendererComponent
    };
    const medicareTable$ = this.api.getMedicareTableFeed();
    const medicaidTable$ = this.api.getMedicaidTableFeed();
    const mortalityTable$ = this.api.getMortalityTableFeed();
    const cmsBarFeed$ = this.api.getCmsBarFeed();
    const viralFeed$ = this.api.getViralFeed();
    this.dataLoading = true;
    this.showError = false;
    forkJoin([medicareTable$, medicaidTable$, mortalityTable$, viralFeed$, cmsBarFeed$]).subscribe({
      next: ([medicareTable, medicaidTable, mortalityTable, viralFeed, cmsBarFeed]) => {
        this.dataLoading = false;
        this.medicareColDefs(medicareTable);
        this.medicaidColDefs(medicaidTable);
        this.mortailityColDefs(mortalityTable);
        this.viralColDefs(viralFeed);

        this.summaryData.colors = ['#8406D1', '#AD1181', '#007bff', '#4833B2']; //cmsBarFeed.rows.map((row) => row.color);
        this.chart.drawChart(cmsBarFeed, this.barChart.nativeElement);
      },
      error: (error) => {
        console.error(error);
        this.showError = true;
      }
    });
  }
  private medicareColDefs(data: any) {
    this.medicareTable = data['rows'] ?? [];
    this.medicareColumnDefs = [
      {
        headerName: 'Record Type',
        field: 'record_type',
        flex: 3
      },
      {
        headerName: 'Avg EHR',
        field: 'avg_ehr',
        flex: 2,

        cellClass: 'light-gray',
        headerClass: 'light-gray'
      },
      {
        headerName: 'Avg Medicare Enhancement',
        field: 'avg_enhancement',
        flex: 3,
        cellClass: 'medicare',
        headerClass: 'medicare',

        cellRenderer: (params: any) => {
          if (params.data !== undefined && params.data !== null) {
            return `
                <strong>${params.data.avg_enhancement}</strong>:
                <small>(Medicare Total: ${params.data.enhancement_total} - Duplicates: ${params.data.duplicate_count})</small>
            `;
          }
          return 'None';
        }
      },
      {
        headerName: 'Total Data',
        field: 'total',
        flex: 10,
        cellRenderer: 'barCellRenderer',
        cellRendererParams: {
          bar1: 'avg_ehr',
          bar2: 'avg_enhancement',
          max: 'max_total',
          colors: ['#d3d4d5', '#8406D1']
        }
      },
      {
        headerName: 'Total (#)',
        field: 'total',
        flex: 1
      },
      {
        headerName: '% Total',
        field: 'percentage_increase',
        flex: 1,
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            return params.value.toFixed(2); // Formats with commas based on locale
          }
          return '';
        }
      }
    ];
  }
  private medicaidColDefs(data: any) {
    this.medicaidTable = data['rows'] ?? [];
    this.medicaidColumnDefs = [
      {
        headerName: 'Record Type',
        field: 'record_type',
        flex: 3
      },
      {
        headerName: 'Avg EHR',
        field: 'avg_ehr',
        flex: 2,
        cellClass: 'light-gray',
        headerClass: 'light-gray'
      },
      {
        headerName: 'Avg Medicaid Enhancement',
        field: 'avg_enhancement',
        flex: 3,
        cellClass: 'medicaid',
        headerClass: 'medicaid',
        cellRenderer: (params: any) => {
          if (params.data !== undefined && params.data !== null) {
            return `
                <strong>${params.data.avg_enhancement}</strong>:
                <small>(Medicare Total: ${params.data.enhancement_total} - Duplicates: ${params.data.duplicate_count})</small>
             `;
          }
          return 'None';
        }
      },
      {
        headerName: 'Total Data',
        field: 'total',
        flex: 10,
        cellRenderer: 'barCellRenderer',
        cellRendererParams: {
          bar1: 'avg_ehr',
          bar2: 'avg_enhancement',
          max: 'max_total',
          colors: ['#d3d4d5', '#AD1181']
        }
      },
      {
        headerName: 'Total (#)',
        field: 'total',
        flex: 1
      },
      {
        headerName: '% Total',
        field: 'percentage_increase',
        flex: 1,
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            return params.value.toFixed(2); // Formats with commas based on locale
          }
          return '';
        }
      }
    ];
  }
  private mortailityColDefs(data: any) {
    this.mortalityTable = data['rows'] ?? [];

    this.mortalityColumnDefs = [
      {
        headerName: 'Record Type',
        field: 'record_type',
        flex: 3,
        valueFormatter: (params: any) => {
          return 'Mortalities';
        }
      },
      {
        headerName: 'Total EHR',
        field: 'total_ehr',
        flex: 2,
        cellClass: 'light-gray',
        headerClass: 'light-gray',
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            return params.value.toLocaleString('en-US'); // Formats with commas based on locale
          }
          return '';
        }
      },
      {
        headerName: 'PPRL Mortaililty Enhancement',
        field: 'enhancement_count',
        flex: 3,
        cellClass: 'mortality',
        headerClass: 'mortality',
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            return params.value.toLocaleString('en-US'); // Formats with commas based on locale
          }
          return '';
        },
        cellRenderer: (params: any) => {
          if (params.data !== undefined && params.data !== null) {
            return `
                <strong>${params.data.enhancement_count.toLocaleString('en-US')}</strong>:
                <small>(Mortality Total: ${params.data.total.toLocaleString('en-US')} - Duplicates: ${params.data.duplicate_count.toLocaleString('en-US')})</small>`;
          }
          return 'None';
        }
      },
      {
        headerName: 'Total Data',
        field: 'total',
        flex: 10,
        cellRenderer: 'barCellRenderer',
        cellRendererParams: {
          bar1: 'duplicate_count',
          bar2: 'enhancement_count',
          max: 'max_total',
          colors: ['#d3d4d5', '#007bff']
        }
      },
      {
        headerName: 'Total (#)',
        field: 'total',
        flex: 1,
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            return params.value.toLocaleString('en-US');
          }
          return '';
        }
      },
      {
        headerName: '% Total',
        field: 'percentage_increase',
        flex: 1,
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            return (+params.value).toFixed(2);
          }
          return '';
        }
      }
    ];
  }

  private viralColDefs(data: any) {
    this.viralTable = data['rows'] ?? [];

    this.viralColumnDefs = [
      {
        headerName: 'Viral Variant',
        field: 'viral_variant',
        flex: 3
      },
      {
        headerName: 'COVID Unknown',
        field: 'covid_unknown',
        flex: 2,
        cellClass: 'covid-unknown',
        headerClass: 'covid-unknown',
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            if (params.value === 0) {
              return '<20'; // Formats with '<20' for values less than 20
            }
            return params.value.toLocaleString('en-US');
          }
          return '';
        }
      },
      {
        headerName: 'COVID Positive',
        field: 'covid_positive',
        flex: 3,
        cellClass: 'covid-positive',
        headerClass: 'covid-positive',
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            if (params.value === 0) {
              return '<20'; // Formats with '<20' for values less than 20
            }
            return params.value.toLocaleString('en-US');
          }
          return '';
        }
      },
      {
        headerName: 'Total Data',
        field: 'total',
        flex: 10,
        cellRenderer: 'barCellRenderer',
        cellRendererParams: {
          bar1: 'covid_unknown',
          bar2: 'covid_positive',
          max: 'max_total',
          colors: ['#7458fc', '#4833B2']
        }
      },
      {
        headerName: 'Total (#)',
        field: 'total',
        flex: 2,
        valueFormatter: (params: any) => {
          if (params.value !== undefined && params.value !== null) {
            return params.value.toLocaleString('en-US'); // Formats with commas based on locale
          }
          return '';
        }
      }
    ];
  }

  // For generating images of visualizations
  public saveAs(format: 'jpg' | 'png', type: 'medicare' | 'medicaid' | 'viral' | 'mortality' | 'summary') {
    let element = this.barChart.nativeElement; // document.getElementById(vizId);
    switch (type) {
      case 'summary':
        element = this.barChart.nativeElement;
        break;
      case 'medicare':
      case 'medicaid':
      case 'viral':
      case 'mortality':
        element = document.getElementById(type);
        break;
    }
    if (!element) {
      console.error(`Error: Unable to find the element for type "${type}". The visualization could not be saved.`);
      return;
    }

    const options = {
      quality: 1,
      backgroundColor: '#fff'
    };

    switch (format) {
      case 'jpg':
        toJpeg(element, options).then((dataUrl) => {
          try {
            saveAs(dataUrl, `${type}.jpg`);
          } catch (error) {
            console.error('Error generating JPEG image:', error);
          }
        });
        break;
      case 'png':
        toPng(element, options).then((dataUrl) => {
          try {
            saveAs(dataUrl, `${type}.png`);
          } catch (error) {
            console.error('Error generating PNG image:', error);
          }
        });
        break;
      default:
        console.error('No image type found');
    }
  }
  onMortalityGridRdy(params: any) {
    this.mortalityApi = params.api;
  }
  onMedicaidGridRdy(params: any) {
    this.medicaidApi = params.api;
  }
  onViralGridRdy(params: any) {
    this.viralApi = params.api;
  }
  onMedicareGridRdy(params: any) {
    this.medicareApi = params.api;
  }
  exportMortality() {
    this.mortalityApi?.exportDataAsCsv({allColumns: true});
  }
  exportMedicaid() {
    this.medicaidApi?.exportDataAsCsv({allColumns: true});
  }
  exportViral() {
    this.viralApi?.exportDataAsCsv({allColumns: true});
  }
  exportMedicare() {
    this.medicareApi?.exportDataAsCsv({allColumns: true});
  }
}
