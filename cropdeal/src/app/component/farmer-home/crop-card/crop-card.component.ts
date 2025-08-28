import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Crop } from '../../../model/crop';

@Component({
  selector: 'app-crop-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crop-card.component.html',
  styleUrl: './crop-card.component.css'
})
export class CropCardComponent {
  @Input() crops: Crop[] = [];
  @Input() newCropData: any = {};
  @Input() saving = false;
  @Output() addCrop = new EventEmitter<void>();
  @Output() saveEditedCrop = new EventEmitter<Crop>();
  @Output() deleteCrop = new EventEmitter<number>();

  showAddForm = false;
  selectedCrop: Crop | null = null;

  onAddCrop() {
    this.addCrop.emit();
    this.showAddForm = false;
  }

  onEditCrop(crop: Crop) {
    this.selectedCrop = { ...crop };
  }

  onDeleteCrop(cropId: number) {
    if (confirm('Are you sure you want to delete this crop?')) {
      this.deleteCrop.emit(cropId);
    }
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    this.selectedCrop = null; // Close edit form when opening add form
  }

  onSaveEditedCrop() {
    if (this.selectedCrop) {
      this.saveEditedCrop.emit(this.selectedCrop);
      this.selectedCrop = null;
    }
  }
}