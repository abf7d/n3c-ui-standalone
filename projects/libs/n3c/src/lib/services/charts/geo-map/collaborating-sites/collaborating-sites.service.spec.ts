import {TestBed} from '@angular/core/testing';

import {CollaboratingSitesService} from './collaborating-sites.service';

describe('CollaboratingSitesService', () => {
  let service: CollaboratingSitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollaboratingSitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
