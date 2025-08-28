import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { Farmer, FarmerService } from '../../service/farmer/farmer.service';

@Component({
  selector: 'app-farmer-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './farmer-list.component.html',
  styleUrls: ['./farmer-list.component.css'],
})
export class FarmerListComponent implements OnInit {
  farmers: Farmer[] = [];

  constructor(private farmerService: FarmerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchFarmers();
  }

  fetchFarmers(): void {
    this.farmerService.getAllFarmers().subscribe({
      next: (data: Farmer[]) => (this.farmers = data),
      error: (err) => console.error('Failed to fetch farmers:', err),
    });
  }

  goToAdd(): void {
    this.router.navigate(['/add-farmer']);
  }

  deleteFarmer(id: number): void {
    if (confirm('Are you sure to delete this farmer?')) {
      this.farmerService.deleteFarmer(id).subscribe({
        next: () => {
          alert('Farmer deleted successfully');
          this.fetchFarmers();
        },
        error: (err) => console.error('Delete failed:', err),
      });
    }
  }

  goToEdit(id: number): void {
    this.router.navigate(['/edit-farmer', id]);
  }
}
