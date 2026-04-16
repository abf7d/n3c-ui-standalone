import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N3cDomainComponent } from './domain.component';

describe('N3cDomainComponent', () => {
  let component: N3cDomainComponent;
  let fixture: ComponentFixture<N3cDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cDomainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
