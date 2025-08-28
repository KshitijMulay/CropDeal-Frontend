import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CropsComponent } from '../crops/crops.component';
import { OnboardingComponent } from '../onboarding/onboarding.component';
// import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive'; ScrollAnimateDirective

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, CropsComponent, OnboardingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userEmail: string | null = '';
  farmerImg:string="https://www.google.com/imgres?q=CropDeal%20is%20a%20trusted%20platform%20connecting%20farmers%20directly%20with%20dealers%20across%20the%20region.%20We%20empower%20farmers%20to%20publish%20their%20crops%2C%20get%20fair%20prices%2C%20and%20build%20lasting%20business%20relationships%20%E2%80%94%20all%20while%20giving%20dealers%20access%20to%20fresh%2C%20quality%20produce%20at%20competitive%20rates.&imgurl=https%3A%2F%2Fimgs.mongabay.com%2Fwp-content%2Fuploads%2Fsites%2F30%2F2020%2F05%2F12111231%2FPic-1-2-e1589262445748-768x512.jpeg&imgrefurl=https%3A%2F%2Findia.mongabay.com%2F2020%2F05%2Fan-online-network-emerges-during-the-lockdown-connecting-farmers-directly-with-customers%2F&docid=bVV_namETaT36M&tbnid=zLJe2DeogBok2M&vet=12ahUKEwj3wqiH4MuNAxX-qVYBHcBKPCkQM3oECGYQAA..i&w=768&h=512&hcb=2&ved=2ahUKEwj3wqiH4MuNAxX-qVYBHcBKPCkQM3oECGYQAA";
  // role: string | null = '';

  router = inject(Router);

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userEmail = payload.sub;
      // this.role = payload.role || 'USER';
    }
  }

   @ViewChild('cropSection') cropSection!: ElementRef;

  scrollToCrops(): void {
    this.cropSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  // scrollToCrops() {
  //   document.querySelector('#cropSection')?.scrollIntoView({ behavior: 'smooth' });
  // }

  goToAdd(): void {
    this.router.navigate(['/add-farmer']);
  }

  viewAllCrops(): void {
    this.router.navigate(['/crops']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
  }
}
