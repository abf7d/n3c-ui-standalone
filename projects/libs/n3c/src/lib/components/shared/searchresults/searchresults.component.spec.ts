import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3CSearchResultsComponent} from './searchresults.component';

describe('N3CSearchResultsComponent', () => {
  let component: N3CSearchResultsComponent;
  let fixture: ComponentFixture<N3CSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3CSearchResultsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3CSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
