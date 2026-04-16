import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cEducationComponent} from './education.component';

describe('N3cEducationComponent', () => {
  let component: N3cEducationComponent;
  let fixture: ComponentFixture<N3cEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cEducationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
