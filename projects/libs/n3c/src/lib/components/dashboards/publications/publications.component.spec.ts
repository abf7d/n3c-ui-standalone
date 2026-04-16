import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cPublicationsComponent} from './publications.component';

describe('N3cPublicationsComponent', () => {
  let component: N3cPublicationsComponent;
  let fixture: ComponentFixture<N3cPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPublicationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
