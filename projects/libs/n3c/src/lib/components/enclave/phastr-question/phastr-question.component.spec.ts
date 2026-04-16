import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N3cPhastrQuestionComponent } from './phastr-question.component';

describe('N3cPhastrQuestionComponent', () => {
  let component: N3cPhastrQuestionComponent;
  let fixture: ComponentFixture<N3cPhastrQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPhastrQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cPhastrQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
