// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Component, OnInit, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-dealer-home',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './dealer-home.component.html',
//   styleUrls: ['./dealer-home.component.css']
// })
// export class DealerHomeComponent implements OnInit {

//   dealer = signal<any>(null);
//   token = signal<string | null>(null);

//   editMode = false;
//   editDealer: any = {}; // Used for form binding during edit

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.token.set(localStorage.getItem('jwtToken'));

//     if (this.token()) {
//       const payload = this.decodeToken(this.token()!);
//       if (payload?.sub) {
//         this.fetchDealerByEmail(payload.sub);
//       } else {
//         console.error('Email not found in token payload.');
//       }
//     } else {
//       console.error('JWT token not found. User not logged in.');
//     }
//   }

//   decodeToken(token: string): any {
//     try {
//       return JSON.parse(atob(token.split('.')[1]));
//     } catch (e) {
//       console.error('Error decoding token', e);
//       return null;
//     }
//   }

//   fetchDealerByEmail(email: string): void {
//     const url = `http://localhost:8000/dealer/profile/email/${email}`;
//     this.http.get<any>(url).subscribe({
//       next: (data) => {
//         this.dealer.set(data);
//         this.editDealer = { ...data }; // Initialize editable copy
//       },
//       error: (err) => console.error('Error fetching dealer by email:', err)
//     });
//   }

//   updateDealerProfile(): void {
//   const url = `http://localhost:8000/dealer/profile/edit/${this.editDealer.dealer_id}`;
//   this.http.put(url, this.editDealer, { responseType: 'text' }).subscribe({
//     next: (data) => {
//       this.dealer.set({ ...this.editDealer });
//       this.editMode = false;
//       alert(data);
//     },
//     error: (err) => {
//       console.error('Error updating dealer profile:', err);
//       alert('Failed to update profile.');
//     }
//   });
// }

//   confirmDelete() {
//     const confirmDel = confirm('Are you sure you want to delete your account? This action cannot be undone.');
//     if (confirmDel) {
//       this.deleteDealer();
//     }
//   }

//   deleteDealer() {
//     this.http.delete(`http://localhost:8000/dealer/delete/${this.dealer().dealer_id}`).subscribe({
//       next: () => {
//         alert('Account deleted successfully!');
//         localStorage.removeItem('jwtToken');
//         window.location.href = '/';
//       },
//       error: (err) => {
//         console.error('Error deleting account:', err);
//         alert('Failed to delete account.');
//       }
//     });
//   }

// }

import { Component, OnInit, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { BankCardComponent } from './bank-card/bank-card.component';
import { MyCropBookingsComponent } from './my-crop-bookings/my-crop-bookings.component';
declare var Razorpay: any;

@Component({
  selector: 'app-dealer-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileCardComponent, BankCardComponent, MyCropBookingsComponent],
  templateUrl: './dealer-home.component.html',
  styleUrls: ['./dealer-home.component.css'],
})
export class DealerHomeComponent implements OnInit {
  dealer = signal<any>(null);
  token = signal<string | null>(null);
  bookings: any[] = [];

  editMode = signal<boolean>(false);
  editDealer: any = {};
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.token.set(localStorage.getItem('jwtToken'));

    if (this.token()) {
      const payload = this.decodeToken(this.token()!);
      if (payload?.sub) {
        this.fetchDealerByEmail(payload.sub);
      }
    }
  }

  // confirmDelete() {
  //   // TODO: Implement delete confirmation logic here
  //   alert('Delete confirmation clicked');
  // }



  // updateDealerProfile() {
  //   // TODO: Implement dealer profile update logic here
  //   alert('Update dealer profile submitted');
  // }



  decodeToken(token: string): any {
    console.log('Decoding token:', token);
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  fetchDealerByEmail(email: string): void {
    console.log('Fetching dealer by email:', email);
    this.http
      .get<any>(`http://localhost:8000/dealer/profile/email/${email}`)
      .subscribe({
        next: (data) => {
          this.dealer.set(data);
          this.editDealer = { ...data };
          localStorage.setItem('DealerId', data.dealer_id);
          console.log('Dealer ID:', data.dealer_id);
          this.fetchBookings();
        },
      });
  }

  fetchBookings(): void {
    const dealerId = this.dealer()?.dealer_id;
    if (!dealerId) return;

    this.http
      .get<any[]>(`http://localhost:8000/dealer/${dealerId}/bookings`)
      .subscribe({
        next: (data) => {
          this.bookings = data;
        },
      });
  }

  payNow(booking: any) {
    const paymentPayload = {
      dealerId: booking.dealerId,
      cropId: booking.cropId,
      amount: booking.price,
    };

    this.openRazorpay(paymentPayload);
  }

  openRazorpay(paymentPayload: any) {
    const options = {
      key: 'rzp_test_BED5G1Mhc2X9R3', // Replace with actual key or use from environment rzp_test_1DP5mmOlF5G5ag
      amount: paymentPayload.amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Crop Payment',
      description: 'Payment for crop booking',
      handler: (response: any) => {
        const finalPayment = {
          ...paymentPayload,
          razorpayPaymentId: response.razorpay_payment_id,
          status: 'SUCCESS',
          time: new Date(),
        };

        this.http
          .post('http://localhost:8000/dealer/pay', finalPayment)
          .subscribe({
            next: () => {
              alert('Payment Successful!');
              this.fetchBookings();
            },
            error: () => alert('Payment processed but not saved.'),
          });
      },
      prefill: {
        name: '', // Optional: Prefill user info
        email: '',
        contact: '',
      },
      theme: {
        color: '#28a745',
      },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
  }

  updateProfile(): void {
    this.saving = true;
    const url = `http://localhost:8000/dealer/profile/edit/${this.dealer().dealer_id}`;
    this.http.put(url, this.editDealer, { responseType: 'text' }).subscribe({
      next: (data) => {
        alert('Profile updated successfully!');
        this.fetchDealerByEmail(this.dealer().email);
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

  confirmDeleteDealer(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.deleteDealer();
    }
  }

  deleteDealer(): void {
    this.deleting = true;
    const url = `http://localhost:8000/dealer/delete/${this.dealer().dealer_id}`;
    this.http.delete(url).subscribe({
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

  prefillBankDetails(): void {
    const bank = this.dealer().bankDetails;
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
    const dealerId = this.dealer().dealer_id;
    const isUpdate = !!this.dealer().bankDetails;
    const url = isUpdate
      ? `http://localhost:8000/dealer/${dealerId}/add-bank-details`
      : `http://localhost:8000/dealer/${dealerId}/update-bank-details`;

    this.http.post(url, this.bankEditData).subscribe({
      next: (res) => {
        alert('Bank details saved successfully!');
        this.fetchDealerByEmail(this.dealer().email);
        this.saving = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error saving bank details. Please try again.');
        this.saving = false;
      },
    });
  }
}
