import {TestBed} from '@angular/core/testing';

import {KpiStatsApiService} from './kpi-stats-api.service';

describe('KpiStatsApiService', () => {
  let service: KpiStatsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiStatsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
