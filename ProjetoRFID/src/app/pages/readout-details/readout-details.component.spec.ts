import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadoutDetailsComponent } from './readout-details.component';

describe('ReadoutDetailsComponent', () => {
  let component: ReadoutDetailsComponent;
  let fixture: ComponentFixture<ReadoutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadoutDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadoutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
