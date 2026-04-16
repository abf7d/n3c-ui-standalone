import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cRegistrationChecklistComponent} from './registration-checklist.component';

describe('RegistrationChecklistComponent', () => {
  let component: N3cRegistrationChecklistComponent;
  let fixture: ComponentFixture<N3cRegistrationChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cRegistrationChecklistComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cRegistrationChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
