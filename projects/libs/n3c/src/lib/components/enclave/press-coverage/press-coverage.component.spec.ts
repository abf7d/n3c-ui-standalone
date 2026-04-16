import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cPressCoverageComponent} from './press-coverage.component';

describe('N3cPressCoverageComponent', () => {
  let component: N3cPressCoverageComponent;
  let fixture: ComponentFixture<N3cPressCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPressCoverageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cPressCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
