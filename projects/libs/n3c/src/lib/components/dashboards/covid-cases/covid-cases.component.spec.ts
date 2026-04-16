import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidCasesComponent } from './covid-cases.component';

describe('CovidCasesComponent', () => {
  let component: CovidCasesComponent;
  let fixture: ComponentFixture<CovidCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CovidCasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CovidCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
