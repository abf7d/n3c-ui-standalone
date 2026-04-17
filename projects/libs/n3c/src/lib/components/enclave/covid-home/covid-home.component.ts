import {Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {forkJoin} from 'rxjs';
import {CountUp} from 'countup.js';
import {SimpleCarouselComponent} from '@odp/shared/lib/carousel/carousel.component';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {RouterModule} from '@angular/router';
import {StrapiResult} from '../../../models/strapi-default';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {FormsModule} from '@angular/forms';
import {dashboardGrid} from '../../../constants/dashboards';
import {CovidHomeApiService} from '../../../services/api/covid-home-api/covid-home-api.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {CurrentRelease, InstitutionSummary} from '@odp/n3c/lib/models/admin-models';
import {GlobalUtilsService} from '@odp/n3c/lib/services/global-utils.service';

@Component({
  selector: 'app-n3c-covid-home',
  templateUrl: './covid-home.component.html',
  styleUrls: ['./covid-home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SimpleCarouselComponent,
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cCovidHomeComponent extends N3cBaseComponent implements OnInit, AfterViewInit {
  enclaveMetrics: any; // Data from first endpoint
  peopleMetrics: any; // Data from second endpoint
  public contentResponse: any;
  cardGroups: any[] = [];
  cardChunks: any[] = [];
  tiles = dashboardGrid;
  cards = dashboardGrid;
  searchTerm: string = '';
  allKeywords: string[] = [];
  filteredKeywords: string[] = [];
  afterInitFired = false;
  dataSuccessfullyLoaded = false;
  intro = '';
  researchers = '';
  currentRelease!: CurrentRelease;
  insitutionSummary!: InstitutionSummary;

  readonly domainTeams: Record<string, string> = {
    cardiology: 'domain',
    diabetes: 'domain',
    environmental: 'domain',
    compromised: 'domain',
    oncology: 'domain',
    'rural-health': 'domain',
    'social-determinants': 'domain',
    'data-methods': 'cross_cutting',
    'cardiothoracic-vascular-surgery': 'inactive_domain',
    vaccination: 'inactive_domain',
    multiorgan: 'inactive_domain',
    'ET-DT': 'inactive_domain',
    elder: 'inactive_domain',
    'gi-liver': 'inactive_domain',
    genomics: 'inactive_domain',
    hematology: 'inactive_domain',
    imaging: 'inactive_domain',
    kidney: 'inactive_domain',
    disabilities: 'inactive_domain',
    'machine-learning': 'inactive_domain',
    musculoskeletal: 'inactive_domain',
    neurology: 'inactive_domain',
    nursing: 'inactive_domain',
    ontology: 'inactive_domain',
    'Oral-health': 'inactive_domain',
    pain: 'inactive_domain',
    pediatrics: 'inactive_domain',
    pharmacoepi: 'inactive_domain',
    pharmacommercial: 'inactive_domain',
    pregnancy: 'inactive_domain',
    sleep: 'inactive_domain',
    Spatial: 'inactive_domain',
    perioperative: 'inactive_domain'
  };

  @ViewChild('peopleTop') peopleTop!: ElementRef<HTMLDivElement>;
  @ViewChild('casesTop') casesTop!: ElementRef<HTMLDivElement>;
  @ViewChild('rowsTop') rowsTop!: ElementRef<HTMLDivElement>;
  @ViewChild('obsTop') obsTop!: ElementRef<HTMLDivElement>;
  @ViewChild('dtasTop') dtasTop!: ElementRef<HTMLDivElement>;
  @ViewChild('duasTop') duasTop!: ElementRef<HTMLDivElement>;
  @ViewChild('projTop') projTop!: ElementRef<HTMLDivElement>;
  @ViewChild('teamsTop') teamsTop!: ElementRef<HTMLDivElement>;
  private titleService = inject(Title);
  private el = inject(ElementRef);
  private router = inject(Router);
  private covidHomeApi = inject(CovidHomeApiService);
  private siteMapApi = inject(SitemapApiService);
  private globalUtils = inject(GlobalUtilsService);

  // code for search button
  // Extract keywords from the tiles
  extractKeywords() {
    this.tiles.forEach((tile) => {
      const words = tile.title.split(' ');
      this.allKeywords.push(...words);
    });
    this.allKeywords = [...new Set(this.allKeywords)];
  }

  // Filter keywords as the user types
  onInputChange() {
    this.filteredKeywords = this.allKeywords.filter((keyword) =>
      keyword.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Handle keyword selection or direct search term
  selectKeyword(selectedKeyword: string) {
    const matchingTiles = this.tiles.filter((tile) => tile.title.toLowerCase().includes(selectedKeyword.toLowerCase()));

    if (matchingTiles.length === 1) {
      this.router.navigateByUrl(matchingTiles[0].link);
    } else {
      this.router.navigate([`/dashboard/searchresults/${selectedKeyword}`], {
        state: {tiles: matchingTiles}
      });
    }
  }
  // serch button code end

  // retrieving the crads from enum file

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C COVID Landing Page');
    this.extractKeywords();
    this.cardGroups = this.groupCards(this.cards, 3);
  }

  ngAfterViewInit(): void {
    this.afterInitFired = true;
    if (this.dataSuccessfullyLoaded) {
      this.dataLoading = false;
      this.startCountUp();
    }
    // Ensuring view children are fully initialized.
  }

  // trackBy function to improve performance of ngFor and reduce rendering cycles
  trackByFn(index: number, item: any) {
    return item.id; // Or a unique identifier within your data
  }

  groupCards(cards: any[], groupSize: number): any[] {
    const groups = [];
    for (let i = 0; i < cards.length; i += groupSize) {
      groups.push(cards.slice(i, i + groupSize));
    }
    return groups;
  }

  override onBaseDataLoaded(): void {
    const encalveMetrics$ = this.covidHomeApi.getEmbeddedEnclaveMetrics();
    const peopleMetrics$ = this.covidHomeApi.getEmbeddedPeopleMetrics();
    const currentRelease$ = this.siteMapApi.getFactSheetCurrentRelease();
    const instSummary$ = this.siteMapApi.getInstitutionSummary();
    const pageContent$ = this.strapiService.get<StrapiResult>('landing-page');
    forkJoin([encalveMetrics$, peopleMetrics$, pageContent$, currentRelease$, instSummary$]).subscribe({
      next: ([enclaveMetrics, peopleMetrics, pageContent, currentRelease, instSummary]) => {
        this.enclaveMetrics = enclaveMetrics; // Response from first API
        this.peopleMetrics = peopleMetrics; // Response from second API
        this.contentResponse = pageContent.data?.attributes || {};
        const domainTeams = pageContent.data?.attributes?.domain_teams?.data;
        this.intro = <string>this.md.parse(this.contentResponse?.introduction);
        this.researchers = <string>this.md.parse(this.contentResponse?.researchers);
        this.currentRelease = currentRelease;
        this.insitutionSummary = instSummary;

        if (this.contentResponse?.testimonials?.data) {
          this.contentResponse.testimonials.data = this.contentResponse.testimonials.data.map((testimonial: any) => {
            return {
              ...testimonial,
              attributes: {
                ...testimonial.attributes,
                quote: this.md.parse(testimonial.attributes.quote),
                author: this.md.parse(testimonial.attributes.author)
              }
            };
          });
        }
        if (domainTeams) {
          this.cardChunks = this.chunkArray(domainTeams, 3); // Chunk the data into groups of 3
        } else {
          console.warn('No domain teams data found.');
        }
        this.dataSuccessfullyLoaded = true;
        if (this.afterInitFired) {
          this.dataLoading = false;
          this.startCountUp();
        }
      },

      error: (error) => {
        this.showError = true;
        console.error('Error loading data', error);
        this.dataLoading = false;
      }
    });
  }
  chunkArray(array: any[], chunkSize: number): any[][] {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  }
  // these are the various counters you see in the STATS section
  startCountUp(): void {
    const formatLargeNumber = this.globalUtils.formatLargeNumber;
    this.initCountUp(this.peopleTop, formatLargeNumber(this.currentRelease.person_rows), 'M', 1);
    this.initCountUp(this.casesTop, this.currentRelease.covid_positive_patients, '', 0); // New CountUp for cases
    this.initCountUp(this.rowsTop, formatLargeNumber(this.currentRelease.total_rows), 'B', 1);
    this.initCountUp(this.obsTop, formatLargeNumber(this.currentRelease.observation_rows), 'B', 1);
    this.initCountUp(this.dtasTop, this.currentRelease.sites_ingested, '', 0);
    this.initCountUp(this.duasTop, this.insitutionSummary.n_institutions, '', 0);
    this.initCountUp(this.projTop, this.peopleMetrics['projects'], '', 0);
    this.initCountUp(this.teamsTop, this.insitutionSummary.n_domain_teams, '', 0);
  }

  initCountUp(elementRef: ElementRef<HTMLDivElement>, value: any, suffix: string, decimals: any): void {
    const numericValue = parseFloat(value);
    if (numericValue && elementRef?.nativeElement) {
      const options = {
        decimalPlaces: decimals,
        duration: 2.5,
        suffix: suffix
      };
      new CountUp(elementRef.nativeElement, numericValue, options).start();
    } else {
      console.error(`CountUp failed: invalid number or element not found for ${suffix}`, value);
    }
  }
  navigateToPage(routePath: string): void {
    this.router.navigate([routePath]);
  }
}
