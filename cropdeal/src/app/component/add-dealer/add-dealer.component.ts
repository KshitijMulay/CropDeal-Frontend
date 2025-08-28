import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-dealer',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-dealer.component.html',
  styleUrl: './add-dealer.component.css'
})
export class AddDealerComponent {

  dealer = {
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

  constructor(private http: HttpClient, private router: Router) {}

  registerDealer(): void {
    if (this.dealer.password !== this.dealer.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (this.dealer.password.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    const { confirmPassword, ...dealerData } = this.dealer;

    this.http.post('http://localhost:8000/user/dealer-register', dealerData).subscribe({
      next: () => {
        alert('Dealer registered successfully!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please check the data or try again.');
      }
    });
  }
}
