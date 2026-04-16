import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N3cAuthenticateComponent } from './authenticate.component';

describe('AuthenticateComponent', () => {
  let component: N3cAuthenticateComponent;
  let fixture: ComponentFixture<N3cAuthenticateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cAuthenticateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cAuthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
