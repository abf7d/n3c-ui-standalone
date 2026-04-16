import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MetforminComponent} from './paxlovid.component';

describe('MetforminComponent', () => {
  let component: MetforminComponent;
  let fixture: ComponentFixture<MetforminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MetforminComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetforminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
