import { TestBed } from '@angular/core/testing';

import { MetforminServiceService } from './metformin.service';

describe('MetforminServiceService', () => {
  let service: MetforminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetforminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
