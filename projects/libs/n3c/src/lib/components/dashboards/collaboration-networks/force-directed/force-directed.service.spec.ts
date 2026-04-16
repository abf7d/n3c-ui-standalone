import {TestBed} from '@angular/core/testing';

import {ForceDirectedService} from './force-directed.service';

describe('ForceDirectedService', () => {
  let service: ForceDirectedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForceDirectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
