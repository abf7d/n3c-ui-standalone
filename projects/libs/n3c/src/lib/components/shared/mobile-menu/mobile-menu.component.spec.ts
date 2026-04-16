import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cMobileMenuComponent} from './mobile-menu.component';

describe('ResponsiveLayoutComponent', () => {
  let component: N3cMobileMenuComponent;
  let fixture: ComponentFixture<N3cMobileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [N3cMobileMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(N3cMobileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
