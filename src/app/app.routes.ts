import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { WarehouseFormComponent } from './warehouse/warehouse-form/warehouse-form.component';
import { WarehouseItemsComponent } from './warehouse/warehouse-items/warehouse-items.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'warehouses', component: WarehouseListComponent },
  { path: 'warehouses/new', component: WarehouseFormComponent },
  { path: 'warehouses/edit/:id', component: WarehouseFormComponent },
  { path: 'warehouses/:id/items', component: WarehouseItemsComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: UserFormComponent },
  { path: 'users/edit/:id', component: UserFormComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/welcome' }
];
