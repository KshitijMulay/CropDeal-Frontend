import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Farmer {
  farmer_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  district: string;
  pincode: string;
  phone_no: string;
}

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  private baseUrl = 'http://localhost:8000/farmer';

  constructor(private http: HttpClient) {}

  getAllFarmers(): Observable<Farmer[]> {
    return this.http.get<Farmer[]>(`${this.baseUrl}/allFarmers`);
  }

  getFarmerById(id: number): Observable<Farmer> {
    return this.http.get<Farmer>(`${this.baseUrl}/profile/${id}`);
  }

  addFarmer(farmer: Farmer): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, farmer, {
      responseType: 'text',
    });
  }

  updateFarmer(id: number, farmer: Farmer): Observable<string> {
    return this.http.put(`${this.baseUrl}/profile/edit/${id}`, farmer, {
      responseType: 'text',
    });
  }

  deleteFarmer(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text',
    });
  }
}
