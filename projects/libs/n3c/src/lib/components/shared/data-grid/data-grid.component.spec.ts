import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RWEDataComponent} from './metformin-grid.component';

describe('RWEDataComponent', () => {
  let component: RWEDataComponent;
  let fixture: ComponentFixture<RWEDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RWEDataComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RWEDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
