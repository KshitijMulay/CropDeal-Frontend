import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent {
  @Input() dealer: any;
  @Input() editMode = signal(false);
  @Input() editData: any = {};
  @Input() saving = false;
  @Input() deleting = false;
  @Output() updateProfile = new EventEmitter<void>();
  @Output() deleteDealer = new EventEmitter<void>();
  @Output() editModeChange = new EventEmitter<boolean>();

  onEditMode(value: boolean) {
    this.editMode.set(value);
    this.editModeChange.emit(value);
  }

  onUpdateProfile() {
    this.updateProfile.emit();
  }

  onDeleteDealer() {
    this.deleteDealer.emit();
  }
}