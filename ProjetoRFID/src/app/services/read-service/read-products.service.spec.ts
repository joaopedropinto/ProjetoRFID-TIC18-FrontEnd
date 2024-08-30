import { TestBed } from '@angular/core/testing';

import { ReadProductsService } from './read-products.service';

describe('ReadProductsService', () => {
  let service: ReadProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
