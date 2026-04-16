import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CollaborationProfilesComponent} from './collaboration-profiles.component';

describe('CollaborationProfilesComponent', () => {
  let component: CollaborationProfilesComponent;
  let fixture: ComponentFixture<CollaborationProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaborationProfilesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CollaborationProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
