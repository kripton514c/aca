import { TestBed } from '@angular/core/testing';

import { SearchSitesService } from './search-sites.service';

describe('SearchSitesService', () => {
  let service: SearchSitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchSitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
