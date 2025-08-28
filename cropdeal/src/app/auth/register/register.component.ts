import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user = {
    email: '',
    password: '',
    confirmPassword: '',
    role: 'FARMER',
  };
  
  loading = false;

  constructor(private authService: AuthService) {}

  register(): void {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    this.loading = true;
    const registerFn =
      this.user.role === 'FARMER'
        ? this.authService.registerFarmer(this.user)
        : this.authService.registerDealer(this.user);

    registerFn.subscribe({
      next: (res) => {
        alert('Registration successful!');
        this.loading = false;
      },
      error: (err) => {
        alert('Registration failed');
        this.loading = false;
      },
    });
  }
}
