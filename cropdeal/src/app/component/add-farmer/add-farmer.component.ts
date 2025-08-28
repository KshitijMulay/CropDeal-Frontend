import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { FarmerService } from '../../service/farmer/farmer.service';


@Component({
  selector: 'app-add-farmer',
  standalone: true,
  // imports: [CommonModule, FormsModule, RouterModule, RouterLink, RouterLinkActive],
  imports: [CommonModule, FormsModule],
  templateUrl: './add-farmer.component.html',
  styleUrl: './add-farmer.component.css'
})
export class AddFarmerComponent {
  farmer = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    pincode: '',
    phone_no: '',
    password: '',
    confirmPassword: ''
  };
  
  loading = false;

  constructor(private farmerService: FarmerService, private router: Router) {}

  addFarmer(): void {
    if (this.farmer.password !== this.farmer.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (this.farmer.password.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    const { confirmPassword, ...farmerData } = this.farmer;

    this.farmerService.addFarmer(farmerData).subscribe({
      next: (res) => {
        alert(res);
        this.router.navigate(['/farmer-list']);
      },
      error: (err) => {
        console.error('Error adding farmer:', err);
        alert('Failed to add farmer');
      },
    });
  }
}
