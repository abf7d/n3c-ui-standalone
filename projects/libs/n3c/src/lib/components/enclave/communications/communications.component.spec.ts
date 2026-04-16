import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cCommunicationsComponent} from './communications.component';

describe('N3cCommunicationsComponent', () => {
  let component: N3cCommunicationsComponent;
  let fixture: ComponentFixture<N3cCommunicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cCommunicationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cCommunicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
