import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cRenalComponent} from './renal.component';

describe('N3cRenalComponent', () => {
  let component: N3cRenalComponent;
  let fixture: ComponentFixture<N3cRenalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cRenalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cRenalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
