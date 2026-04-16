import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RenderChartComponent} from './render-chart.component';

describe('RenderChartComponent', () => {
  let component: RenderChartComponent;
  let fixture: ComponentFixture<RenderChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RenderChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
