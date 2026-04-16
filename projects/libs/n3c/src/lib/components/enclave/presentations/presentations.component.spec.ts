import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cPresentationsPageComponent} from './presentations.component';

describe('N3cPolicyComponent', () => {
  let component: N3cPresentationsPageComponent;
  let fixture: ComponentFixture<N3cPresentationsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPresentationsPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cPresentationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
