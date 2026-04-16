import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CollaborationNetworksComponent} from './collaboration-networks.component';

describe('CollaborationNetworksComponent', () => {
  let component: CollaborationNetworksComponent;
  let fixture: ComponentFixture<CollaborationNetworksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaborationNetworksComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CollaborationNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
