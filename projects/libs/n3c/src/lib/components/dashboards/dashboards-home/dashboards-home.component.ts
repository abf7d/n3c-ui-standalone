import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {dashboard_tiles, dashboardGrid} from '../../../constants/dashboards';
import {DashboardFooterComponent} from '@odp/shared/lib/n3c/dashboard-footer/dashboard-footer.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {SitemapApiService} from '@odp/n3c/lib/services/api/site-map-api/site-map-api.service';
import {forkJoin} from 'rxjs';
import {CurrentNotes, CurrentRelease} from '@odp/n3c/lib/models/admin-models';
import {LongCompactNumberPipe} from '@odp/n3c/lib/pipes/long-compact-number.pipe';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-about',
  templateUrl: './dashboards-home.component.html',
  styleUrls: ['./dashboards-home.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    DashboardFooterComponent,
    HeaderViewComponent,
    LongCompactNumberPipe,
    N3cLoaderComponent
  ]
})
export class N3cDashboardsHomeComponent implements OnInit, OnDestroy {
  private titleService = inject(Title);
  private router = inject(Router);
  private siteApi = inject(SitemapApiService);

  constructor() {
    this.titleService.setTitle('N3C Dashboards');
  }
  dashboardGrid = dashboardGrid;

  tiles = dashboard_tiles;

  tiles_inTheSpotlight_ids = new Set([
    'Enclave_Health',
    'Site_Collaboration_Profile',
    'Metformin',
    'PPRL_Enrichment',
    'PPRL',
    'Paxlovid',
    'Long_COVID',
    'Medication_Time_Series',
    'Regional_Distribution_of_COVID_Patients'
  ]);

  tiles_inTheSpotlight = this.tiles.filter((tile) => this.tiles_inTheSpotlight_ids.has(tile.id));

  tiles_overview_ids = new Set([
    'Demographics',
    'Demographics_Table_for_IRB',
    'Mortality',
    'Enclave_Health',
    'Regional_Distribution_of_COVID_Patients'
  ]);

  tiles_overview = this.tiles.filter((tile) => this.tiles_overview_ids.has(tile.id));

  tiles_members_ids = new Set([
    'Site_Collaboration_Profile',
    'Institutional_Collaboration_Map',
    'Institutions_Contributing_Data',
    'Inter-Institutional_Publications_Map',
    'Publications',
    'Collaboration_Networks',
    'N3C_Teams',
    'Site_and_User_Metrics',
    'N3C_Concept_Sets'
  ]);

  tiles_members = this.tiles.filter((tile) => this.tiles_members_ids.has(tile.id));

  tiles_tracking_ids = new Set([
    'PPRL_Enrichment',
    'PPRL',
    'Paxlovid',
    'Cumulative_and_Average_COVID_Cases',
    'Medication_Time_Series'
  ]);

  tiles_tracking = this.tiles.filter((tile) => this.tiles_tracking_ids.has(tile.id));

  tiles_cases_ids = new Set(['Cumulative_and_Average_COVID_Cases', 'Reinfection', 'Reinfection_Time_Series']);

  tiles_cases = this.tiles.filter((tile) => this.tiles_cases_ids.has(tile.id));

  tiles_meds_ids = new Set(['Paxlovid', 'Medication_Time_Series', 'Medications_Snapshots', 'Metformin']);

  tiles_meds = this.tiles.filter((tile) => this.tiles_meds_ids.has(tile.id));

  tiles_disease_ids = new Set([
    'Disease_Snapshots',
    'Substance_Use',
    'Long_COVID',
    'Smoking',
    'RECOVER_Initiative',
    'Environmental_Factors'
  ]);

  tiles_disease = this.tiles.filter((tile) => this.tiles_disease_ids.has(tile.id));

  currentRelease!: CurrentRelease;
  currentNotes!: CurrentNotes;
  dataLoading: boolean = true;
  showError: boolean = false;

  private loadFactSheetData(): void {
    const currentRelease$ = this.siteApi.getFactSheetCurrentRelease();
    const currentNotes$ = this.siteApi.getFactSheetCurrentNotes();

    this.dataLoading = true;
    this.showError = false;
    forkJoin([currentRelease$, currentNotes$]).subscribe(
      ([currentRelease, currentNotes]: [CurrentRelease, CurrentNotes]) => {
        this.currentRelease = currentRelease;
        this.currentNotes = currentNotes;
        this.dataLoading = false;
        this.showError = false;
      },
      (error) => {
        this.showError = true;
        this.dataLoading = false;
        console.error('api error:', error);
      }
    );
  }

  // code for search button

  searchTerm: string = '';
  allKeywords: string[] = [];
  filteredKeywords: string[] = [];

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
      this.router.navigate([`n3c/dashboard/searchresults/${selectedKeyword}`], {
        state: {tiles: matchingTiles}
      });
    }
  }

  // serch button code end

  //dot navigation for 7 carousels

  currentSlides = [0, 0, 0, 0, 0, 0, 0]; // Tracks the current slide for all carousels

  prevSlide(carouselIndex: number) {
    if (this.currentSlides[carouselIndex] > 0) {
      this.currentSlides[carouselIndex]--;
      this.updateCarousel(carouselIndex);
    }
  }

  updateCarousel(carouselIndex: number) {
    const track = document.querySelectorAll('.carousel-track')[carouselIndex] as HTMLElement;
    const slides = track.querySelectorAll('.carousel-slide') as NodeListOf<HTMLElement>;
    const slideWidth = slides[0]?.clientWidth || 0; // Get the width of the first slide
    track.style.transform = `translateX(-${this.currentSlides[carouselIndex] * slideWidth}px)`;
  }

  nextSlide(carouselIndex: number) {
    const track = document.querySelectorAll('.carousel-track')[carouselIndex] as HTMLElement;
    const slides = track.querySelectorAll('.carousel-slide');
    if (this.currentSlides[carouselIndex] < slides.length - 1) {
      this.currentSlides[carouselIndex]++;
      this.updateCarousel(carouselIndex);
    }
  }

  disableNextButton(carouselIndex: number): boolean {
    const track = document.querySelectorAll('.carousel-track')[carouselIndex] as HTMLElement;
    const slides = track.querySelectorAll('.carousel-slide');
    return this.currentSlides[carouselIndex] >= slides.length - 2;
  }

  updateTrackWidth() {
    const tracks = document.querySelectorAll('.carousel-track') as NodeListOf<HTMLElement>;
    tracks.forEach((track) => {
      const slides = track.querySelectorAll('.carousel-slide') as NodeListOf<Element>;
      let totalWidth = 0;
      slides.forEach((slide) => {
        const slideElement = slide as HTMLElement;
        totalWidth += slideElement.clientWidth;
      });
      track.style.width = `${totalWidth}px`;
    });
  }

  setActiveSlide(carouselIndex: number, slideIndex: number) {
    this.currentSlides[carouselIndex] = slideIndex;
    this.updateCarousel(carouselIndex);
  }

  getTiles(carouselIndex: number): any[] {
    switch (carouselIndex) {
      case 0:
        return this.tiles_inTheSpotlight;
      case 1:
        return this.tiles_overview;
      case 2:
        return this.tiles_members;
      case 3:
        return this.tiles_tracking;
      case 4:
        return this.tiles_cases;
      case 5:
        return this.tiles_meds;
      case 6:
        return this.tiles_disease;
      default:
        return [];
    }
  }

  // front carousel starts

  images: string[] = [
    '../assets/n3c/images/slide_1.png',
    '../assets/n3c/images/slide_2.png',
    './assets/n3c/images/slide_3.png'
  ];

  currentIndex: number = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoplay();
    this.extractKeywords();
    this.loadFactSheetData();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.updateTransform();
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateTransform();
  }

  goToPublication(): void {
    window.open('https://covid.cd2h.org/dashboard/publications', '_blank');
  }

  navigateTo(url: string): void {
    window.open(url, '_blank');
  }

  startAutoplay(): void {
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000); // Change slide every 3 second
  }

  updateTransform(): void {
    const offset = -this.currentIndex * 100;
    const carouselImages = document.querySelector('front-carousel-images') as HTMLElement;
    if (carouselImages) {
      carouselImages.style.transform = `translateX(${offset}%)`;
    }
  }

  scrollToDashboards(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({behavior: 'smooth'});
    }
  }
  navigateToPage(routePath: string): void {
    this.router.navigate([routePath]);
  }
}
