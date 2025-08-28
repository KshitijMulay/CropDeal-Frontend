import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-crop-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-crop-bookings.component.html',
  styleUrl: './my-crop-bookings.component.css'
})
export class MyCropBookingsComponent {
  @Input() bookings: any[] = [];
  @Output() payNow = new EventEmitter<any>();

  onPayNow(booking: any) {
    this.payNow.emit(booking);
  }
}