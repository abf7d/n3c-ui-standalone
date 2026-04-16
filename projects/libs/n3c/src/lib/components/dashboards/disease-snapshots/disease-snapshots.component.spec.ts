import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DiseaseSnapshotsComponent} from './disease-snapshots.component';

describe('DiseaseSnapshotsComponent', () => {
  let component: DiseaseSnapshotsComponent;
  let fixture: ComponentFixture<DiseaseSnapshotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiseaseSnapshotsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DiseaseSnapshotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
