import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaborationMapComponent } from './collaboration-map.component';

describe('CollaborationMapComponent', () => {
  let component: CollaborationMapComponent;
  let fixture: ComponentFixture<CollaborationMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaborationMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollaborationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
