import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cMissionComponent} from './mission.component';

describe('N3cMissionComponent', () => {
  let component: N3cMissionComponent;
  let fixture: ComponentFixture<N3cMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cMissionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
