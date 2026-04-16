import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DisclaimerFooterComponent} from './disclaimer-footer.component';

describe('DisclaimerFooterComponent', () => {
  let component: DisclaimerFooterComponent;
  let fixture: ComponentFixture<DisclaimerFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclaimerFooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DisclaimerFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
