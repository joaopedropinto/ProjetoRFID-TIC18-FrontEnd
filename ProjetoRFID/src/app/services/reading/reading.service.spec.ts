import { TestBed } from '@angular/core/testing';

import { ReadingService } from './reading.service';

describe('ReadingService', () => {
  let service: ReadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
