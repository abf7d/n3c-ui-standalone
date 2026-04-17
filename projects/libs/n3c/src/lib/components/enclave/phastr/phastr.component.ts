import {Component, inject, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterModule, ActivatedRoute} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {StrapiResult} from '../../../models/strapi-default';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';
import {N3cPhastrQuestionComponent} from '../phastr-question/phastr-question.component';
import {first, forkJoin} from 'rxjs';
import {N3cLoaderComponent} from '../../shared/loader/loader.component';
import {N3cMenuComponent} from '../../shared/menu/menu.component';
import {HeaderViewComponent} from '../../shared/header-view/header-view.component';
import {N3cEnclaveFooterComponent} from '../../shared/enclave-footer/enclave-footer.component';

@Component({
  selector: 'app-n3c-phastr',
  templateUrl: './phastr.component.html',
  styleUrls: ['./phastr.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    MatIconModule,
    MatExpansionModule,
    N3cPhastrQuestionComponent,
    N3cLoaderComponent,
    N3cMenuComponent,
    HeaderViewComponent,
    N3cEnclaveFooterComponent
  ]
})
export class N3cPhastrComponent extends N3cBaseComponent implements OnInit {
  public output: any;
  public frameworkComponents: any;
  public id: string | null = null;
  public childContent: any = null;

  private titleService = inject(Title);
  public contentManager = inject(ContentManagerService);
  private route = inject(ActivatedRoute);

  constructor() {
    super();
    this.contentBlock = ['public_health_questions', 'faqs'];
  }

  ngOnInit() {
    this.initDataByRoute();
    this.titleService.setTitle('N3C - PHASTR');
  }

  override onBaseDataLoaded(): void {
    // Fetch content and initial query param
    forkJoin([
      this.strapiService.get<StrapiResult>('phastr', this.contentBlock),
      this.route.queryParams.pipe(first())
    ]).subscribe(([pageContent, queryParam]) => {
      this.pageContent = pageContent.data?.attributes || {};
      this.pageContent = this.contentManager.parseMdContent(this.pageContent);
      this.pageContent.header = 'N3C Public Health Answers to Speed Tractable Results (PHASTR)';
      this.pageContent.eligibility = this.md.parse(pageContent.data?.attributes.eligibility);
      this.pageContent.public_health_questions = this.contentManager.getContentObj(
        this.pageContent,
        'public_health_questions'
      );
      this.pageContent.faqs = this.contentManager.getContentObj(this.pageContent, 'faqs');

      this.updateChildContent(queryParam['id']);
      this.dataLoading = false;
    });

    // Subscribe to query params to update child content when the URL changes
    this.route.queryParams.subscribe((params) => {
      this.updateChildContent(params['id']);
    });
  }

  updateChildContent(idParam: string | null): void {
    this.id = idParam;
    if (!this.pageContent?.public_health_questions) {
      this.childContent = null;
      return;
    }

    if (!idParam) {
      this.childContent = null;
      return;
    }

    const id = +idParam;
    if (!isNaN(id)) {
      this.childContent = this.pageContent.public_health_questions.filter((x: any) => x.id === id);
    } else {
      this.childContent = null;
    }
  }
}
