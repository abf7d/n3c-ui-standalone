import {ComponentFixture, TestBed} from '@angular/core/testing';

import {N3cDownloadComponent} from './download.component';

describe('N3cDownloadComponent', () => {
  let component: N3cDownloadComponent;
  let fixture: ComponentFixture<N3cDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [N3cDownloadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(N3cDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
