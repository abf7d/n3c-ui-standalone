import {TestBed} from '@angular/core/testing';

import {BaseGeoMapService} from './base-geo-map.service';

describe('BaseGeoMapService', () => {
  let service: BaseGeoMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseGeoMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
