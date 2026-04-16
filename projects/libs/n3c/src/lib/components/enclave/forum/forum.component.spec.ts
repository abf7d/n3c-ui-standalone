import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cForumComponent} from './forum.component';

describe('N3cForumComponent', () => {
  let component: N3cForumComponent;
  let fixture: ComponentFixture<N3cForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cForumComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
