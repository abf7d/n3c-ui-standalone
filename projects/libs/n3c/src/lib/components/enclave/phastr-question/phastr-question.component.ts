import {Component, inject, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {ContentManagerService} from '../../../services/content-manager/content-manager.service';
import {N3cBaseComponent} from '@odp/shared/lib/n3c/base/base.component';

@Component({
  selector: 'app-n3c-phastr-question',
  templateUrl: './phastr-question.component.html',
  styleUrls: ['./phastr-question.component.scss'],
  imports: [CommonModule, RouterModule, MatIconModule, MatExpansionModule]
})
export class N3cPhastrQuestionComponent extends N3cBaseComponent implements OnInit, OnChanges {
  public question: any;
  private readonly keysToParse = [
    'description',
    'aims',
    'analysis_plan',
    'expected_results',
    'inclusion_criteria',
    'exclusion_criteria',
    'phenotype',
    'deliverables'
  ];

  @Input() content: any;

  private titleService = inject(Title);
  public contentManager = inject(ContentManagerService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.initDataByRoute();

    this.route.paramMap.subscribe((params) => {
      this.question = params.get('id');
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] && this.content && this.content.length > 0) {
      this.titleService.setTitle('N3C - PHASTR Question');
      this.parseProps(this.content[0]);
    }
  }

  private parseProps(content: Record<string, string>) {
    for (const key of this.keysToParse) {
      content[key] = this.md.parse(content[key]) as string;
    }
  }
}
