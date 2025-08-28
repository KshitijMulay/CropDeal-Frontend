import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Farmer, FarmerService } from '../../service/farmer/farmer.service';

@Component({
  selector: 'app-edit-farmer',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './edit-farmer.component.html',
  styleUrl: './edit-farmer.component.css',
})
export class EditFarmerComponent {
  farmerId!: number;
  farmer: Farmer = {
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    pincode: '',
    phone_no: '',
  };

  constructor(
    private farmerService: FarmerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.farmerId = +this.route.snapshot.paramMap.get('id')!;
    this.farmerService.getFarmerById(this.farmerId).subscribe({
      next: (data) => (this.farmer = data),
      error: (err) => console.error('Failed to load farmer:', err),
    });
  }

  updateFarmer(): void {
    this.farmerService.updateFarmer(this.farmerId, this.farmer).subscribe({
      next: (res) => {
        alert(res);
        this.router.navigate(['/farmer-list']);
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update farmer');
      },
    });
  }
}
