import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N3cPublicationReviewComponent } from './publication-review.component';

describe('N3cPublicationReviewComponent', () => {
  let component: N3cPublicationReviewComponent;
  let fixture: ComponentFixture<N3cPublicationReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPublicationReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cPublicationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
