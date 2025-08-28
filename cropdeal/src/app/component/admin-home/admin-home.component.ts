// AdminHomeComponent.ts
import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
  private http = inject(HttpClient);

  farmers = signal<any[]>([]);
  dealers = signal<any[]>([]);
  crops = signal<any[]>([]);
  reviews = signal<any[]>([]);
  notifications = signal<any[]>([]);

  private _showFarmers = signal(false);
  private _showDealers = signal(false);
  private _showCrops = signal(false);
  private _showReviews = signal(false);
  private _showNotifications = signal(false);
  private _showAll = signal(false);

  // Use these in ngModel bindings
  get showFarmers() {
    return this._showFarmers();
  }
  set showFarmers(value: boolean) {
    this._showFarmers.set(value);
  }

  get showDealers() {
    return this._showDealers();
  }
  set showDealers(value: boolean) {
    this._showDealers.set(value);
  }

  get showCrops() {
    return this._showCrops();
  }
  set showCrops(value: boolean) {
    this._showCrops.set(value);
  }

  get showReviews() {
    return this._showReviews();
  }
  set showReviews(value: boolean) {
    this._showReviews.set(value);
  }

  get showNotifications() {
    return this._showNotifications();
  }
  set showNotifications(value: boolean) {
    this._showNotifications.set(value);
  }

  get showAll() {
    return this._showAll();
  }
  set showAll(value: boolean) {
    this._showAll.set(value);
  }

  toggleAll() {
    const allValue = this._showAll();
    this._showFarmers.set(allValue);
    this._showDealers.set(allValue);
    this._showCrops.set(allValue);
    this._showReviews.set(allValue);
    this._showNotifications.set(allValue);
  }

  token = localStorage.getItem('jwt');
  headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });

  constructor() {
    effect(() => {
      if (this._showFarmers()) {
        this.http.get<any[]>('http://localhost:8000/admin/farmer/allFarmers', { headers: this.headers })
          .subscribe(data => this.farmers.set(data));
      } else {
        this.farmers.set([]);
      }

      if (this._showDealers()) {
        this.http.get<any[]>('http://localhost:8000/admin/dealer/allDealers', { headers: this.headers })
          .subscribe(data => this.dealers.set(data));
      } else {
        this.dealers.set([]);
      }

      if (this._showCrops()) {
        this.http.get<any[]>('http://localhost:8000/admin/crop/allCrops', { headers: this.headers })
          .subscribe(data => this.crops.set(data));
      } else {
        this.crops.set([]);
      }

      if (this._showReviews()) {
        this.http.get<any[]>('http://localhost:8000/admin/crop/reviews', { headers: this.headers })
          .subscribe(data => this.reviews.set(data));
      } else {
        this.reviews.set([]);
      }

      if (this._showNotifications()) {
        this.http.get<any[]>('http://localhost:8000/admin/notify/allnotifications', { headers: this.headers })
          .subscribe(data => this.notifications.set(data));
      } else {
        this.notifications.set([]);
      }
    });
  }
  deleteFarmer(id: number): void {
  if (confirm('Are you sure you want to delete this farmer?')) {
    this.http.delete(`http://localhost:8000/admin/farmer/delete/${id}`, { headers: this.headers })
      .subscribe(() => {
        // Remove the deleted farmer from the list
        this.farmers.set(this.farmers().filter(f => f.farmer_id !== id));
        alert('Farmer deleted successfully.');
      }, error => {
        console.error('Error deleting farmer:', error);
        alert('Failed to delete farmer.');
      });
  }
}

deleteDealer(id: number): void {
  if (confirm('Are you sure you want to delete this dealer?')) {
    this.http.delete(`http://localhost:8000/admin/dealer/delete/${id}`, { headers: this.headers })
      .subscribe(() => {
        // Remove the deleted dealer from the list
        this.dealers.set(this.dealers().filter(d => d.dealer_id !== id));
        alert('Dealer deleted successfully.');
      }, error => {
        console.error('Error deleting dealer:', error);
        alert('Failed to delete dealer.');
      });
  }
}


}
