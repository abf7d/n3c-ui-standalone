import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SiteUserMetricsComponent} from './site-user-metrics.component';

describe('SiteUserMetricsComponent', () => {
  let component: SiteUserMetricsComponent;
  let fixture: ComponentFixture<SiteUserMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteUserMetricsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteUserMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
