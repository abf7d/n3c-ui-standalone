import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N3cPhastrComponent } from './phastr.component';

describe('N3cPhastrComponent', () => {
  let component: N3cPhastrComponent;
  let fixture: ComponentFixture<N3cPhastrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPhastrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cPhastrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
