import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cClinicalCohortComponent} from './clinical-cohort.component';

describe('N3cClinicalCohortComponent', () => {
  let component: N3cClinicalCohortComponent;
  let fixture: ComponentFixture<N3cClinicalCohortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cClinicalCohortComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cClinicalCohortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
