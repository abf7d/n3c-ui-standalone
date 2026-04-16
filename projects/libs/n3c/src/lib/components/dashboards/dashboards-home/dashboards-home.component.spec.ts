import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cDashboardsHomeComponent} from './dashboards-home.component';

describe('N3cDashboardsHomeComponent', () => {
  let component: N3cDashboardsHomeComponent;
  let fixture: ComponentFixture<N3cDashboardsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cDashboardsHomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cDashboardsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
