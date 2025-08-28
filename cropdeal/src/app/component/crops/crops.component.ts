import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
declare var Razorpay: any;

@Component({
  selector: 'app-crops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crops.component.html',
  styleUrls: ['./crops.component.css'],
})
export class CropsComponent implements OnInit {
  crops: any[] = [];
  filteredCrops: any[] = [];
  displayedCrops: any[] = [];
  loading = false;
  error = '';
  isLoggedIn = false;
  isFullPage = false;
  
  // Search and filter properties
  searchTerm = '';
  selectedCropType = '';
  sortBy = 'cropName';
  sortOrder = 'asc';
  cropTypes = ['All', 'Grain', 'Vegetable', 'Fruit', 'Spice', 'Other'];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.isFullPage = window.location.pathname === '/crops';
    this.fetchCrops();
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('jwtToken');
    this.isLoggedIn = !!token;
  }

  fetchCrops(): void {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8000/crop/allCrops').subscribe({
      next: (data) => {
        this.crops = data;
        this.filteredCrops = data;
        this.updateDisplayedCrops();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load crops.';
        this.loading = false;
      },
    });
  }

  getDealerIdFromToken(): number {
    const token = localStorage.getItem('jwtToken');
    if (!token) return 0;
    // const decoded: any = jwtDecode(token);

    const id = localStorage.getItem('DealerId');
    const idnum = id ? parseInt(id) : 0;
    return idnum;
  }

  redirectToLogin(): void {
    window.location.href = '/login';
  }

  bookAndPay(crop: any) {
    const dealerId = this.getDealerIdFromToken();
    console.log('Dealer ID:', dealerId);
    const quantity = crop.selectedQuantity;

    if (!quantity || quantity <= 0 || quantity > crop.quantityAvailable) {
      alert('Please enter a valid quantity.');
      return;
    }

    const bookingPayload = {
      dealerId,
      cropId: crop.cropId,
      quantity,
    };

    this.http
      .post('http://localhost:8000/dealer/book', bookingPayload, { responseType: 'text' })
      .subscribe({
        next: (bookingResponse: any) => {
          this.router.navigate(['/dealer-home']);
        },
        error: () => {
          alert('Booking failed. Please try again.');
        },
      });
  }

  // Search, filter, and sort methods
  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.crops];

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(crop => 
        crop.cropName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        crop.cropType.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply crop type filter
    if (this.selectedCropType && this.selectedCropType !== 'All') {
      filtered = filtered.filter(crop => crop.cropType === this.selectedCropType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[this.sortBy];
      let bValue = b[this.sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (this.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    this.filteredCrops = filtered;
    this.updateDisplayedCrops();
  }

  updateDisplayedCrops(): void {
    this.displayedCrops = this.isFullPage ? this.filteredCrops : this.filteredCrops.slice(0, 8);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCropType = '';
    this.sortBy = 'cropName';
    this.sortOrder = 'asc';
    this.filteredCrops = [...this.crops];
    this.updateDisplayedCrops();
  }
}
