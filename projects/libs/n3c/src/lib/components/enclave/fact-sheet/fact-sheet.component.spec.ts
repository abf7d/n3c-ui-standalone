import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cFactSheetComponent} from './fact-sheet.component';

describe('N3cFactSheetComponent', () => {
  let component: N3cFactSheetComponent;
  let fixture: ComponentFixture<N3cFactSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [N3cFactSheetComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(N3cFactSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
