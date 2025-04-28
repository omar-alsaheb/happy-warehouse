import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Warehouse } from '../../models/warehouse.model';
import { WarehouseService } from '../../services/warehouse.service';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss']
})
export class WarehouseListComponent implements OnInit {
  warehouses: Warehouse[] = [];
  filteredWarehouses: Warehouse[] = [];
  loading = false;
  error = '';
  isAdmin = false;
  isManager = false;
  searchTerm = '';
  showActiveOnly = false;
  viewMode: 'table' | 'cards' = 'table';

  constructor(
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check user role for permission-based UI
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isAdmin = currentUser.role === UserRole.Admin;
    this.isManager = currentUser.role === UserRole.Management;

    // Load warehouses
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.loading = true;
    this.error = '';
    
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load warehouses. Please try again later.';
        console.error('Error loading warehouses', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.warehouses];
    
    // Apply active filter
    if (this.showActiveOnly) {
      filtered = filtered.filter(w => w.isActive);
    }
    
    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(term) || 
        w.location.toLowerCase().includes(term) ||
        (w.description && w.description.toLowerCase().includes(term))
      );
    }
    
    this.filteredWarehouses = filtered;
  }

  search(): void {
    this.applyFilters();
  }

  setViewMode(mode: 'table' | 'cards'): void {
    this.viewMode = mode;
  }

  deleteWarehouse(warehouse: Warehouse): void {
    if (!confirm(`Are you sure you want to delete the warehouse "${warehouse.name}"?`)) {
      return;
    }

    this.loading = true;
    this.warehouseService.deleteWarehouse(warehouse.id!).subscribe({
      next: () => {
        this.loadWarehouses(); // Refresh the list
      },
      error: (err) => {
        this.error = 'Failed to delete warehouse. Please try again later.';
        console.error('Error deleting warehouse', err);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
