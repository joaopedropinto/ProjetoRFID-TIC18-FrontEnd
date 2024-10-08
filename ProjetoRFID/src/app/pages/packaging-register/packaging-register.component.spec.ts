import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingRegisterComponent } from './packaging-register.component';

describe('PackagingRegisterComponent', () => {
  let component: PackagingRegisterComponent;
  let fixture: ComponentFixture<PackagingRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagingRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackagingRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
