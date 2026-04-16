import { TestBed } from '@angular/core/testing';

import { PaxlovidService } from './paxlovid.service';

describe('PaxlovidService', () => {
  let service: PaxlovidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaxlovidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
