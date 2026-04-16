import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiPanelComponent } from './kpi-panel.component';

describe('KpiPanelComponent', () => {
  let component: KpiPanelComponent;
  let fixture: ComponentFixture<KpiPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KpiPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
