import {TestBed} from '@angular/core/testing';

import {RegionalFlatMapService} from './regional-flat-map.service';

describe('RegionalFlatMapService', () => {
  let service: RegionalFlatMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionalFlatMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
