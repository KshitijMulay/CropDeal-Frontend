import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Crop } from '../../model/crop';
import { RatingsAndReviewsDTO } from '../../model/review';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { BankCardComponent } from './bank-card/bank-card.component';
import { CropCardComponent } from './crop-card/crop-card.component';

declare global {
  interface Window {
    bootstrap: any;
  }
}

@Component({
  selector: 'app-farmer-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProfileCardComponent, BankCardComponent, CropCardComponent],
  templateUrl: './farmer-home.component.html',
  styleUrl: './farmer-home.component.css',
})
export class FarmerHomeComponent implements OnInit {
  farmer = signal<any>(null);
  token = signal<string | null>(null);

  editMode = signal<boolean>(false);
  editBankMode = signal<boolean>(false);

  editData: any = {}; // For profile editing
  bankEditData: any = {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    upiNumber: '',
  };
  saving = false;
  deleting = false;
  activeSection: string | null = null;

  // 🌾 Crop-related signals
  crops = signal<Crop[]>([]);
  selectedCrop = signal<Crop | null>(null);
  newCropData: any = {
    cropName: '',
    cropType: '',
    quantityAvailable: 0,
    pricePerKg: 0,
  };
  newCrop: Crop = {
    cropName: '',
    cropType: '',
    quantityAvailable: 0,
    pricePerKg: 0,
    quantityBooked: 0,
    status: 'Available',
  };

  reviews = signal<RatingsAndReviewsDTO[]>([]);
  reviewSearchTerm = ''; // bound to input

  // Available Crops section
  allAvailableCrops = signal<Crop[]>([]);
  filteredCrops = signal<Crop[]>([]);
  searchTerm = '';
  selectedCropType = '';
  sortBy = 'cropName';
  sortOrder = 'asc';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.token.set(localStorage.getItem('jwtToken'));
    if (this.token()) {
      const payload = this.decodeToken(this.token()!);
      if (payload?.sub) this.fetchFarmerByEmail(payload.sub);
    }
  }

  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  fetchFarmerByEmail(email: string): void {
    const url = `http://localhost:8000/farmer/profile/email/${email}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.farmer.set(data);
        this.editData = { ...data };
        this.fetchCropsByFarmer(data.farmer_id); // 👈 Fetch crops
        this.getAllReviews();
      },
      error: (err) => console.error('Error fetching farmer:', err),
    });
  }

  confirmDeleteFarmer(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.deleteFarmer();
    }
  }

  updateProfile(): void {
    this.saving = true;
    const url = `http://localhost:8000/farmer/profile/edit/${
      this.farmer().farmer_id
    }`;
    this.http.put(url, this.editData, this.getAuthHeader()).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.fetchFarmerByEmail(this.farmer().email);
        this.editMode.set(false);
        this.saving = false;
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Failed to update profile. Please try again.');
        this.saving = false;
      },
    });
  }

  prefillBankDetails(): void {
    const bank = this.farmer().bankDetails;
    this.bankEditData = bank
      ? { ...bank }
      : {
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          upiId: '',
          upiNumber: '',
        };
  }

  saveBankDetails(): void {
    this.saving = true;
    const farmerId = this.farmer().farmer_id;
    const isUpdate = !!this.farmer().bankDetails;
    const url = isUpdate
      ? `http://localhost:8000/farmer/${farmerId}/add-bank-details`
      : `http://localhost:8000/farmer/${farmerId}/update-bank-details`;

    this.http.post(url, this.bankEditData, this.getAuthHeader()).subscribe({
      next: (res) => {
        alert('Bank details saved successfully!');
        this.fetchFarmerByEmail(this.farmer().email);
        this.saving = false;
        const modalEl = document.getElementById('bankDetailsModal');
        if (modalEl) {
          const modal =
            window.bootstrap?.Modal.getInstance(modalEl) ||
            new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error saving bank details. Please try again.');
        this.saving = false;
      },
    });
  }

  addCrop(): void {
    this.saving = true;
    const farmerId = this.farmer().farmer_id;
    const url = `http://localhost:8000/farmer/${farmerId}/publish-crop`;

    const cropData = {
      ...this.newCropData,
      quantityBooked: 0,
      status: 'Available'
    };

    this.http.post(url, cropData, {
      ...this.getAuthHeader(),
      responseType: 'text' as 'json',
    }).subscribe({
      next: () => {
        alert('Crop added successfully!');
        this.fetchCropsByFarmer(farmerId);
        this.newCropData = {
          cropName: '',
          cropType: '',
          quantityAvailable: 0,
          pricePerKg: 0,
        };
        this.saving = false;
        const modalEl = document.getElementById('addCropModal');
        if (modalEl) {
          const modal = window.bootstrap?.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
          modal.hide();
        }
      },
      error: (err) => {
        console.error('Add crop failed:', err);
        alert('Failed to add crop. Please try again.');
        this.saving = false;
      },
    });
  }

  deleteFarmer(): void {
    this.deleting = true;
    const url = `http://localhost:8000/farmer/delete/${
      this.farmer().farmer_id
    }`;
    this.http.delete(url, this.getAuthHeader()).subscribe({
      next: () => {
        alert('Account deleted successfully!');
        localStorage.clear();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete account. Please try again.');
        this.deleting = false;
      },
    });
  }

  // 🌾 Crop-related methods

  fetchCropsByFarmer(farmerId: number): void {
    const url = `http://localhost:8000/farmer/${farmerId}/crops`;
    this.http.get<Crop[]>(url, this.getAuthHeader()).subscribe({
      next: (data) => this.crops.set(data),
      error: (err) => console.error('Error fetching crops:', err),
    });
  }

  publishCrop(): void {
    const farmerId = this.farmer().farmer_id;
    const url = `http://localhost:8000/farmer/${farmerId}/publish-crop`;

    this.http
      .post(url, this.newCrop, {
        ...this.getAuthHeader(),
        responseType: 'text' as 'json',
      })
      .subscribe({
        next: () => {
          window.location.reload();
          this.fetchCropsByFarmer(farmerId);
          this.newCrop = {
            cropName: '',
            cropType: '',
            quantityAvailable: 0,
            pricePerKg: 0,
            quantityBooked: 0,
            status: 'Available',
          };
        },
        error: (err) => console.error('Publish failed:', err),
      });
  }

  saveEditedCrop(crop: Crop): void {
    this.saving = true;
    const farmerId = this.farmer().farmer_id;
    if (!crop?.cropId) return;

    const url = `http://localhost:8000/farmer/${farmerId}/edit-crop/${crop.cropId}`;
    this.http.put(url, crop, {
      ...this.getAuthHeader(),
      responseType: 'text' as 'json',
    }).subscribe({
      next: () => {
        alert('Crop updated successfully!');
        this.fetchCropsByFarmer(farmerId);
        this.saving = false;
      },
      error: (err) => {
        console.error('Edit failed:', err);
        alert('Failed to update crop. Please try again.');
        this.saving = false;
      },
    });
  }

  deleteCrop(cropId: number): void {
    const farmerId = this.farmer().farmer_id;
    const url = `http://localhost:8000/farmer/${farmerId}/delete-crop/${cropId}`;
    if (confirm('Delete this crop?')) {
      this.http
        .delete(url, {
          ...this.getAuthHeader(),
          responseType: 'text' as 'json',
        })
        .subscribe({
          next: () => {
            window.location.reload();
            this.fetchCropsByFarmer(farmerId);
          },
          error: (err) => console.error('Delete failed:', err),
        });
    }
  }

  getAllReviews(): void {
    this.http
      .get<RatingsAndReviewsDTO[]>(
        'http://localhost:8000/farmer/reviews',
        this.getAuthHeader()
      )
      .subscribe({
        next: (data) => this.reviews.set(data),
        error: (err) => console.error('Error fetching all reviews:', err),
      });
  }

  searchReviewsByCropName(): void {
    const name = this.reviewSearchTerm.trim();
    if (!name) return;

    const url = `http://localhost:8000/farmer/review/id/${name}`;
    this.http.get<RatingsAndReviewsDTO[]>(url, this.getAuthHeader()).subscribe({
      next: (data) => this.reviews.set(data),
      error: (err) => {
        console.error('Error fetching reviews by crop name:', err);
        this.reviews.set([]); // Clear if no result
      },
    });
  }

  getAuthHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token()}`,
        'Content-Type': 'application/json',
      }),
    };
  }
}
