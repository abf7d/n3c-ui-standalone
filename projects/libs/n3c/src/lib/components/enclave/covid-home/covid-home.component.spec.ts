import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cCovidHomeComponent} from './covid-home.component';

describe('N3cLandingPageComponent', () => {
  let component: N3cCovidHomeComponent;
  let fixture: ComponentFixture<N3cCovidHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [N3cCovidHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(N3cCovidHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
