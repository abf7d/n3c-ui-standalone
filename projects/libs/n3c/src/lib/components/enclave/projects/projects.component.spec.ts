import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cProjectsPageComponent} from './projects.component';

describe('N3cPressCoverageComponent', () => {
  let component: N3cProjectsPageComponent;
  let fixture: ComponentFixture<N3cProjectsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cProjectsPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cProjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
