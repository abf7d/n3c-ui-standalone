import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cEnclaveAccountCreationComponent} from './enclave-account-creation.component';

describe('N3cEnclaveAccountCreationComponent', () => {
  let component: N3cEnclaveAccountCreationComponent;
  let fixture: ComponentFixture<N3cEnclaveAccountCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cEnclaveAccountCreationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cEnclaveAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
