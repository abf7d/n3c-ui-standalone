import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cMenuComponent} from './menu.component';

describe('N3cMenuComponent', () => {
  let component: N3cMenuComponent;
  let fixture: ComponentFixture<N3cMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [N3cMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(N3cMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
