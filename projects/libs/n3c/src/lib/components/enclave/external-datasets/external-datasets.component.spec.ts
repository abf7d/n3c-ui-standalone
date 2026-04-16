import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExternalDatasetsComponent} from './external-datasets.component';

describe('ExternalDatasetsComponent', () => {
  let component: ExternalDatasetsComponent;
  let fixture: ComponentFixture<ExternalDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalDatasetsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
