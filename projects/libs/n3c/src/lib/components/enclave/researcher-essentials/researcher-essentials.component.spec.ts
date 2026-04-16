import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cResearcherEssentialsComponent} from './researcher-essentials.component';

describe('N3cResearcherEssentialsComponent', () => {
  let component: N3cResearcherEssentialsComponent;
  let fixture: ComponentFixture<N3cResearcherEssentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cResearcherEssentialsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cResearcherEssentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
