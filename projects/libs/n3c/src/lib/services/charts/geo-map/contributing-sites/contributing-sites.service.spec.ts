import {TestBed} from '@angular/core/testing';

import {ContributingSitesService} from './contributing-sites.service';

describe('ContributingSitesService', () => {
  let service: ContributingSitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContributingSitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
