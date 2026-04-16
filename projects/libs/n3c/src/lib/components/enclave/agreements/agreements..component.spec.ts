import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cAgreementsComponent} from './agreements.component';

describe('N3cCovidExtensionComponent', () => {
  let component: N3cAgreementsComponent;
  let fixture: ComponentFixture<N3cAgreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cAgreementsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
