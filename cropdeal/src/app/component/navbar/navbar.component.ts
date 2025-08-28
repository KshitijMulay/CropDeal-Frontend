import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  email: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        const jwtToken = this.authService.getToken() || '';
        this.email = this.decodeEmailFromToken(jwtToken);
      } else {
        this.email = '';
      }
    });
  }

  logout(): void {
  localStorage.clear();
  this.authService.logout();
  this.router.navigate(['/']);
}


  onProfile(): void {
    const decodedToken: any = jwtDecode(localStorage.getItem('jwtToken') || '');
    const role = decodedToken.role;

    if (role === 'FARMER') {
      this.router.navigateByUrl('/farmer-home');
    } else if (role === 'DEALER') {
      this.router.navigateByUrl('/dealer-home');
    } else if (role === 'ADMIN') {
      this.router.navigateByUrl('/admin-home');
    } else {
      alert('Unknown role. Cannot redirect.');
    }
  }

  private decodeEmailFromToken(jwtToken: string): string {
    if (!jwtToken) return '';

    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      console.log('Decoded JWT Payload:', payload); // ← Log this to inspect it
      return payload.sub || ''; // adjust to 'name' if you want name
    } catch (e) {
      console.error('Invalid token:', e);
      return '';
    }
  }
}
