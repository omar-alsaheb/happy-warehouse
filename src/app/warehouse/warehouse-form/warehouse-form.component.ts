import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/user.model';
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../models/warehouse.model';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss']
})
export class WarehouseFormComponent implements OnInit {
  warehouseForm!: FormGroup;
  isEditMode = false;
  warehouseId?: number;
  submitted = false;
  loading = false;
  error = '';
  isAdmin = false;
  isManager = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit(): void {
    // Check user permission
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Set role flags
    this.isAdmin = currentUser.role === UserRole.Admin;
    this.isManager = currentUser.role === UserRole.Management;

    // Check if user has permission to access this page
    if (!this.isAdmin && !this.isManager) {
      this.router.navigate(['/welcome']);
      return;
    }

    // Initialize form
    this.initForm();

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.warehouseId = +params['id'];
        this.isEditMode = true;
        this.loadWarehouse(this.warehouseId);
      }
    });
  }

  // Initialize the form
  initForm(): void {
    this.warehouseForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      isActive: [true]
    });
  }

  // Load warehouse data if in edit mode
  loadWarehouse(id: number): void {
    this.loading = true;
    this.warehouseService.getWarehouseById(id).subscribe({
      next: (warehouse) => {
        if (warehouse) {
          this.warehouseForm.patchValue({
            name: warehouse.name,
            location: warehouse.location,
            capacity: warehouse.capacity,
            description: warehouse.description,
            isActive: warehouse.isActive
          });
        } else {
          this.error = 'Warehouse not found';
          setTimeout(() => this.router.navigate(['/warehouses']), 2000);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load warehouse data';
        console.error('Error loading warehouse', err);
        this.loading = false;
      }
    });
  }

  // Form submission handler
  onSubmit(): void {
    this.submitted = true;

    // Stop if form is invalid
    if (this.warehouseForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const warehouseData: Warehouse = {
      ...this.warehouseForm.value,
      id: this.isEditMode ? this.warehouseId : undefined,
      createdDate: this.isEditMode ? undefined : new Date()
    };

    if (this.isEditMode) {
      this.updateWarehouse(warehouseData);
    } else {
      this.createWarehouse(warehouseData);
    }
  }

  // Create new warehouse
  createWarehouse(warehouse: Warehouse): void {
    this.warehouseService.addWarehouse(warehouse).subscribe({
      next: () => {
        this.router.navigate(['/warehouses']);
      },
      error: (err) => {
        this.error = 'Failed to create warehouse';
        console.error('Error creating warehouse', err);
        this.loading = false;
      }
    });
  }

  // Update existing warehouse
  updateWarehouse(warehouse: Warehouse): void {
    this.warehouseService.updateWarehouse(warehouse).subscribe({
      next: () => {
        this.router.navigate(['/warehouses']);
      },
      error: (err) => {
        this.error = 'Failed to update warehouse';
        console.error('Error updating warehouse', err);
        this.loading = false;
      }
    });
  }

  // Reset form to initial state
  resetForm(): void {
    this.submitted = false;
    
    if (this.isEditMode && this.warehouseId) {
      this.loadWarehouse(this.warehouseId);
    } else {
      this.warehouseForm.reset({
        isActive: true
      });
    }
  }

  // Navigate back to warehouses list
  navigateBack(): void {
    this.router.navigate(['/warehouses']);
  }

  // Convenience getter for easy access to form fields
  get f() { return this.warehouseForm.controls; }

  // Logout function
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
