import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContributingSitesComponent} from './contributing-sites.component';

describe('ContributingSitesComponent', () => {
  let component: ContributingSitesComponent;
  let fixture: ComponentFixture<ContributingSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributingSitesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ContributingSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
