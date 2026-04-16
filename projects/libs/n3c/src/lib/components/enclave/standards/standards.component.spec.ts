import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cStandardsPageComponent} from './standards.component';

describe('N3cStandardsPageComponent', () => {
  let component: N3cStandardsPageComponent;
  let fixture: ComponentFixture<N3cStandardsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cStandardsPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cStandardsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
