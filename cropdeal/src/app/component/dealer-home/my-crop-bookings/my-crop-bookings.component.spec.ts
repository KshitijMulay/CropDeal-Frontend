import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCropBookingsComponent } from './my-crop-bookings.component';

describe('MyCropBookingsComponent', () => {
  let component: MyCropBookingsComponent;
  let fixture: ComponentFixture<MyCropBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCropBookingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCropBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
