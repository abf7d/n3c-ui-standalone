import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cToolsComponent} from './tools.component';

describe('N3cSupportComponent', () => {
  let component: N3cToolsComponent;
  let fixture: ComponentFixture<N3cToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cToolsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
