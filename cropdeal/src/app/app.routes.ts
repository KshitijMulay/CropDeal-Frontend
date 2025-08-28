import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { AddFarmerComponent } from './component/add-farmer/add-farmer.component';
import { FarmerListComponent } from './component/farmer-list/farmer-list.component';
import { EditFarmerComponent } from './component/edit-farmer/edit-farmer.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { FarmerHomeComponent } from './component/farmer-home/farmer-home.component';
import { DealerHomeComponent } from './component/dealer-home/dealer-home.component';
import { AdminHomeComponent } from './component/admin-home/admin-home.component';
import { CropsComponent } from './component/crops/crops.component';
import { AddDealerComponent } from './component/add-dealer/add-dealer.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'add-farmer',
    component: AddFarmerComponent,
  },
  {
    path: 'add-dealer',
    component: AddDealerComponent,
  },
  { path: 'farmer-home', component: FarmerHomeComponent },
  { path: 'dealer-home', component: DealerHomeComponent },
  { path: 'admin-home', component: AdminHomeComponent },
  {
    path: 'farmer-list',
    component: FarmerListComponent,
  },
  {
    path: 'edit-farmer/:id',
    component: EditFarmerComponent,
  },
  { path: 'crops', component: CropsComponent },
  {
    path: '**',
    redirectTo: 'pg-not-found',
  },
  {
    path: 'pg-not-found',
    component: PageNotFoundComponent,
  },
];
