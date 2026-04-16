import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PprlLimitationComponent} from './pprl-limitation.component';

describe('PprlLimitationComponent', () => {
  let component: PprlLimitationComponent;
  let fixture: ComponentFixture<PprlLimitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PprlLimitationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PprlLimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
