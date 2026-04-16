import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cCovidAboutComponent} from './covid-about.component';

describe('N3cAboutComponent', () => {
  let component: N3cCovidAboutComponent;
  let fixture: ComponentFixture<N3cCovidAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cCovidAboutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cCovidAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
