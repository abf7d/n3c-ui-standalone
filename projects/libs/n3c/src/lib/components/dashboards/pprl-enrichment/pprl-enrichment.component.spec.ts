import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PprlEnrichmentComponent} from './pprl-enrichment.component';

describe('PprlEnrichmentComponent', () => {
  let component: PprlEnrichmentComponent;
  let fixture: ComponentFixture<PprlEnrichmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PprlEnrichmentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PprlEnrichmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
