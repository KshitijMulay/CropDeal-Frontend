import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userObj: any = {
    email: '',
    password: '',
  };
  
  loading = false;

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
 

  onLogin() {
    this.loading = true;
    this.http.post('http://localhost:8000/user/login', this.userObj).subscribe({
      next: (res: any) => {
        if (res?.token) {
          alert('Login success');
          localStorage.setItem('jwtToken', res.token);
          
          const decodedToken: any = jwtDecode(res.token);
          const role = decodedToken.role;
          this.authService.setToken(res.token); 

          if (role === 'FARMER') {
            this.router.navigateByUrl('/farmer-home');
          } else if (role === 'DEALER') {
            this.router.navigateByUrl('/dealer-home');
          } else if (role === 'ADMIN') {
            this.router.navigateByUrl('/admin-home');
          } else {
            alert('Unknown role. Cannot redirect.');
          }
        } else {
          alert('Login failed');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed.');
        this.loading = false;
      },
    });
  }
}

