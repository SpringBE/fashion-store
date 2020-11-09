import { TestBed } from '@angular/core/testing';

import { ShopeaseService } from './shopease.service';

describe('ShopeaseService', () => {
  let service: ShopeaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopeaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
