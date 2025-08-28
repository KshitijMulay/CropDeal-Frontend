import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/user'; /////////// 

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  registerFarmer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/farmer-register`, data, { responseType: 'text' });
  }

  registerDealer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/dealer-register`, data, { responseType: 'text' });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data, { responseType: 'text' });
  }

  setToken(token: string): void {
    localStorage.setItem('jwtToken', token);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.loggedIn.next(false);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwtToken');
  }
}
