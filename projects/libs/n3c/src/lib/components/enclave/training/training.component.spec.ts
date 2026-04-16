import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cTrainingPageComponent} from './training.component';

describe('N3cSupportComponent', () => {
  let component: N3cTrainingPageComponent;
  let fixture: ComponentFixture<N3cTrainingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cTrainingPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cTrainingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
