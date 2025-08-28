import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bank-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-card.component.html',
  styleUrl: './bank-card.component.css'
})
export class BankCardComponent {
  @Input() farmer: any;
  @Input() bankEditData: any = {};
  @Input() saving = false;
  @Output() saveBankDetails = new EventEmitter<void>();
  @Output() prefillBankDetails = new EventEmitter<void>();

  editMode = false;

  onEditMode() {
    this.editMode = true;
    this.prefillBankDetails.emit();
  }

  onSave() {
    this.saveBankDetails.emit();
    this.editMode = false;
  }

  onCancel() {
    this.editMode = false;
  }
}