import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N3cOnboardingComponent } from './onboarding.component';

describe('N3cOnboardingComponent', () => {
  let component: N3cOnboardingComponent;
  let fixture: ComponentFixture<N3cOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cOnboardingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
