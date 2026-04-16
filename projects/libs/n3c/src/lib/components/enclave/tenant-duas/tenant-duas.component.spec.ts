import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cTenantDuasPageComponent} from './tenant-duas.component';

describe('N3cSupportComponent', () => {
  let component: N3cTenantDuasPageComponent;
  let fixture: ComponentFixture<N3cTenantDuasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cTenantDuasPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cTenantDuasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
