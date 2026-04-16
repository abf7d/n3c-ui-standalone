import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cTutorialComponent} from './tutorial.component';

describe('N3cTutorialComponent', () => {
  let component: N3cTutorialComponent;
  let fixture: ComponentFixture<N3cTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cTutorialComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
