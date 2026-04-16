import {TestBed} from '@angular/core/testing';

import {CollaboratingSitesApiService} from './collaborating-sites-api.service';

describe('CollaboratingSitesApiService', () => {
  let service: CollaboratingSitesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaboratingSitesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
