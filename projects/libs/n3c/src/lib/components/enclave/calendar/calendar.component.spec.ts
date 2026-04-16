import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cCalendarComponent} from './calendar.component';

describe('N3cCalendarComponent', () => {
  let component: N3cCalendarComponent;
  let fixture: ComponentFixture<N3cCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cCalendarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
