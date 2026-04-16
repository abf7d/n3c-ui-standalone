import {TestBed} from '@angular/core/testing';

import {HiveApiService} from './hive-api.service';

describe('HiveApiService', () => {
  let service: HiveApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiveApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
