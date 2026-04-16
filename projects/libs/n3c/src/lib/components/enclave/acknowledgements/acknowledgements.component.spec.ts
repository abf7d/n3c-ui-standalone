import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cAcknowledgementsComponent} from './acknowledgements.component';

describe('N3cAcknowledgementsComponent', () => {
  let component: N3cAcknowledgementsComponent;
  let fixture: ComponentFixture<N3cAcknowledgementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cAcknowledgementsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cAcknowledgementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
