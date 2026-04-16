import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PprlEnrichmentHomeComponent} from './pprl-enrichment-home.component';

describe('PprlEnrichmentHomeComponent', () => {
  let component: PprlEnrichmentHomeComponent;
  let fixture: ComponentFixture<PprlEnrichmentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PprlEnrichmentHomeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PprlEnrichmentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
