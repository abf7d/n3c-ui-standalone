import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CollaboratingSitesApiService} from '../../../services/api/collaborating-sites-api/collaborating-sites-api.service';
import {CollaborationProfile} from '../../../models/collaboration-profile';
import {PieBarService} from '../../../services/charts/pie-bar/pie-bar.service';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';

@Component({
  selector: 'app-site-overview',
  standalone: true,
  imports: [CommonModule, N3cLoaderComponent],
  providers: [PieBarService],
  templateUrl: './site-overview.component.html',
  styleUrls: ['./site-overview.component.scss']
})
export class SiteOverviewComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() siteName: string = '';
  @Input() siteId: string = '';
  @ViewChild('instDonut', {static: false}) instDonutRef!: ElementRef<HTMLDivElement>;

  publishingSitesImgUrl: string | null = null;
  collaboratingSitesImgUrl: string | null = null;
  profile: CollaborationProfile | null = null;
  loading = true;
  showError = false;

  private viewReady = false;
  protected instColors: Record<string, string> = {
    N3C: '#007bff',
    CTSA: '#8406d1',
    GOV: '#09405a',
    CTR: '#ad1181',
    COM: '#ffa600',
    UNAFFILIATED: '#ff7155'
  };

  constructor(
    private collabApi: CollaboratingSitesApiService,
    private pies: PieBarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateStaticAssets();
    this.loadProfile();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['siteId']) {
      this.updateStaticAssets();
      this.loadProfile();
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderInstitutionsDonut();
  }

  private updateStaticAssets(): void {
    this.publishingSitesImgUrl = this.collabApi.getPublishingSitesImageUrl(this.siteId);
    this.collaboratingSitesImgUrl = this.collabApi.getCollaboratingSitesMapImageUrl(this.siteId);
  }

  private loadProfile(): void {
    if (!this.siteId) {
      this.profile = null;
      this.loading = false;
      this.showError = false;
      this.clearDonut();
      return;
    }

    this.loading = true;
    this.showError = false;

    this.collabApi.getCollaborationProfile(this.siteId).subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
        this.showError = false;

        this.cdr.detectChanges();
        this.renderInstitutionsDonut();
      },
      error: () => {
        this.profile = null;
        this.loading = false;
        this.showError = true;
        this.clearDonut();
      }
    });
  }

  private renderInstitutionsDonut(): void {
    const el = this.instDonutRef?.nativeElement;
    const items = this.profile?.institutions ?? [];
    if (!this.viewReady || !el) return;

    el.innerHTML = '';
    if (!items.length) return;

    const data = items.map((i) => ({key: i.org_type, count: i.count}));
    this.pies.drawDonutCountsInside(el, data, this.instColors, {
      size: 380,
      innerRatio: 0.3,
      fontSize: 16,
      minLabelAngle: 0.06
    });
  }

  private clearDonut(): void {
    const el = this.instDonutRef?.nativeElement;
    if (el) el.innerHTML = '';
  }

  instCount(type: string): number {
    return this.profile?.institutions?.find((i) => i.org_type === type)?.count ?? 0;
  }
}
