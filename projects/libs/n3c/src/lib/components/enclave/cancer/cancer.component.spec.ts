import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cCancerComponent} from './cancer.component';

describe('N3cCancerComponent', () => {
  let component: N3cCancerComponent;
  let fixture: ComponentFixture<N3cCancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cCancerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cCancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
