import {TestBed} from '@angular/core/testing';

import {ProjectGraphApiService} from './project-graph-api.service';

describe('ProjectGraphApiService', () => {
  let service: ProjectGraphApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectGraphApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
