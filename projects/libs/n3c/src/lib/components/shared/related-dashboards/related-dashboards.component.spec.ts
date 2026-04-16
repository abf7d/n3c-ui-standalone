import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RelatedDashboardsComponent} from './related-dashboards.component';

describe('RelatedDashboardsComponent', () => {
  let component: RelatedDashboardsComponent;
  let fixture: ComponentFixture<RelatedDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedDashboardsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
