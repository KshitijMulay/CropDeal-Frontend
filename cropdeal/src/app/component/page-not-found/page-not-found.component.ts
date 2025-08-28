import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

}
