import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MasterDetailListComponent} from './master-detail-list.component';

describe('MasterDetailListComponent', () => {
  let component: MasterDetailListComponent;
  let fixture: ComponentFixture<MasterDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDetailListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
