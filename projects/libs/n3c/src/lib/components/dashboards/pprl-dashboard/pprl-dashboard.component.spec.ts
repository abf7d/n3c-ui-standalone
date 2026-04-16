import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PprlDashboardComponent} from './pprl-dashboard.component';

describe('PprlDashboardComponent', () => {
  let component: PprlDashboardComponent;
  let fixture: ComponentFixture<PprlDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PprlDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PprlDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
