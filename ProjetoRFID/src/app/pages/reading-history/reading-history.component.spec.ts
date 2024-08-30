import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingHistoryComponent } from './reading-history.component';

describe('ReadingHistoryComponent', () => {
  let component: ReadingHistoryComponent;
  let fixture: ComponentFixture<ReadingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
