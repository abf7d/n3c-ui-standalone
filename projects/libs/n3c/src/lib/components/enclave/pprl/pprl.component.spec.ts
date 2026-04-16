import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cPprlComponent} from './pprl.component';

describe('N3cPprlComponent', () => {
  let component: N3cPprlComponent;
  let fixture: ComponentFixture<N3cPprlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cPprlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cPprlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
