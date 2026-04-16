import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DataDistributionDemographicsComponent} from './dataDistribution-demographics.component';

describe('N3cPublicationsComponent', () => {
  let component: DataDistributionDemographicsComponent;
  let fixture: ComponentFixture<DataDistributionDemographicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataDistributionDemographicsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DataDistributionDemographicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
