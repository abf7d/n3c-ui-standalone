import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsMapComponent } from './publications-map.component';

describe('PublicationsMapComponent', () => {
  let component: PublicationsMapComponent;
  let fixture: ComponentFixture<PublicationsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
