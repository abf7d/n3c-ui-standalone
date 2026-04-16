import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConceptSetsComponent} from './concept-sets.component';

describe('ConceptSetsComponent', () => {
  let component: ConceptSetsComponent;
  let fixture: ComponentFixture<ConceptSetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConceptSetsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConceptSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
