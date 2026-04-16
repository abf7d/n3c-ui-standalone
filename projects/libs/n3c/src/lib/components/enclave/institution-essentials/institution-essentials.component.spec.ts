import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cInstitutionEssentialsComponent} from './institution-essentials.component';

describe('N3cInstitutionEssentialsComponent', () => {
  let component: N3cInstitutionEssentialsComponent;
  let fixture: ComponentFixture<N3cInstitutionEssentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cInstitutionEssentialsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cInstitutionEssentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
