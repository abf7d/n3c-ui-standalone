import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cFaqPageComponent} from './faq.component';

describe('N3cFaqPageComponent', () => {
  let component: N3cFaqPageComponent;
  let fixture: ComponentFixture<N3cFaqPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [N3cFaqPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(N3cFaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
