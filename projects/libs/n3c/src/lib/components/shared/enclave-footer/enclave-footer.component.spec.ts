import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cEnclaveFooterComponent} from './enclave-footer.component';

describe('FooterComponent', () => {
  let component: N3cEnclaveFooterComponent;
  let fixture: ComponentFixture<N3cEnclaveFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cEnclaveFooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cEnclaveFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
