import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubstanceUseComponent} from './substance-use.component';

describe('SubstanceUseComponent', () => {
  let component: SubstanceUseComponent;
  let fixture: ComponentFixture<SubstanceUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubstanceUseComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SubstanceUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
