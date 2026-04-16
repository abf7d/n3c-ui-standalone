import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StackedBarChartsComponent} from './stacked-bar-charts.component';

describe('StackedBarChartsComponent', () => {
  let component: StackedBarChartsComponent;
  let fixture: ComponentFixture<StackedBarChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedBarChartsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StackedBarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
