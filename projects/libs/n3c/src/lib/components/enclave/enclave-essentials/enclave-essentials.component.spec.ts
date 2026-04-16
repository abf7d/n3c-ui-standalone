import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnclaveEssentialsComponent } from './enclave-essentials.component';

describe('EnclaveEssentialsComponent', () => {
  let component: EnclaveEssentialsComponent;
  let fixture: ComponentFixture<EnclaveEssentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnclaveEssentialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnclaveEssentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
