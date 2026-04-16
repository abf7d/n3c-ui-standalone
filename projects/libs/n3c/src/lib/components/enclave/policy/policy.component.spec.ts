import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cPolicyComponent} from './policy.component';

describe('N3cPolicyComponent', () => {
  let component: N3cPolicyComponent;
  let fixture: ComponentFixture<N3cPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPolicyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
