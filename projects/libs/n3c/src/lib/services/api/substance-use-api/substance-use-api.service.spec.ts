import {TestBed} from '@angular/core/testing';

import {SubstanceUseApiService} from './substance-use-api.service';

describe('SubstanceUseApiService', () => {
  let service: SubstanceUseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubstanceUseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
