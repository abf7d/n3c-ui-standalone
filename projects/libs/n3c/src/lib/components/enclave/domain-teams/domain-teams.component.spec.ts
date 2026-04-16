import { ComponentFixture, TestBed } from '@angular/core/testing';

import { N3cDomainTeamsComponent } from './domain-teams.component';

describe('DomainTeamsComponent', () => {
  let component: N3cDomainTeamsComponent;
  let fixture: ComponentFixture<N3cDomainTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cDomainTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(N3cDomainTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
