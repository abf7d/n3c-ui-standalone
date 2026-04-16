import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiDimensionalSummaryComponent} from './multi-dimensional-summary.component';

describe('MultiDimensionalSummaryComponent', () => {
  let component: MultiDimensionalSummaryComponent;
  let fixture: ComponentFixture<MultiDimensionalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiDimensionalSummaryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MultiDimensionalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
