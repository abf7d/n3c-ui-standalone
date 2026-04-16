import {TestBed} from '@angular/core/testing';

import {VerticalBarService} from './veritical-bar.service';

describe('VerticalBarService', () => {
  let service: VerticalBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerticalBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
