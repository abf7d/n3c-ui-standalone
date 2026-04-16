import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnclaveHealthComponent } from './enclave-health.component';

describe('EnclaveHealthComponent', () => {
  let component: EnclaveHealthComponent;
  let fixture: ComponentFixture<EnclaveHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnclaveHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnclaveHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
