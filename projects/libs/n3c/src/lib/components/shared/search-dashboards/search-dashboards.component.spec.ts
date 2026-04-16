import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchDashboardsComponent} from './search-dashboards.component';

describe('SearchDashboardsComponent', () => {
  let component: SearchDashboardsComponent;
  let fixture: ComponentFixture<SearchDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDashboardsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
