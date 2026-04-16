import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cBaseComponent} from './base.component';

describe('N3cBaseComponent', () => {
  let component: N3cBaseComponent;
  let fixture: ComponentFixture<N3cBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cBaseComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
