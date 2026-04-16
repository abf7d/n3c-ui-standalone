import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DataFiltersComponent} from './data-filters.component';

describe('DataFiltersComponent', () => {
  let component: DataFiltersComponent;
  let fixture: ComponentFixture<DataFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFiltersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
