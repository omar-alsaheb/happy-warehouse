import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Warehouse } from '../models/warehouse.model';
import { WarehouseItem } from '../models/warehouse-item.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  // Mock warehouses data
  private warehouses: Warehouse[] = [
    { 
      id: 1, 
      name: 'Main Warehouse', 
      location: 'New York', 
      capacity: 10000, 
      createdDate: new Date(2023, 0, 10), 
      isActive: true,
      description: 'Main storage facility for electronics'
    },
    { 
      id: 2, 
      name: 'South Center', 
      location: 'Miami', 
      capacity: 8000, 
      createdDate: new Date(2023, 2, 15), 
      isActive: true,
      description: 'Southern distribution center'
    },
    { 
      id: 3, 
      name: 'West Facility', 
      location: 'Los Angeles', 
      capacity: 12000, 
      createdDate: new Date(2023, 4, 22), 
      isActive: true,
      description: 'Main western storage hub'
    }
  ];

  // Mock warehouse items data
  private warehouseItems: WarehouseItem[] = [
    {
      id: 1,
      warehouseId: 1,
      name: 'Laptop',
      quantity: 150,
      category: 'Electronics',
      price: 999.99,
      addedDate: new Date(2023, 1, 10),
      expirationDate: undefined
    },
    {
      id: 2,
      warehouseId: 1,
      name: 'Smartphone',
      quantity: 300,
      category: 'Electronics',
      price: 699.99,
      addedDate: new Date(2023, 1, 15),
      expirationDate: undefined
    },
    {
      id: 3,
      warehouseId: 2,
      name: 'Coffee Beans',
      quantity: 400,
      category: 'Food',
      price: 15.99,
      addedDate: new Date(2023, 3, 5),
      expirationDate: new Date(2024, 3, 5)
    },
    {
      id: 4,
      warehouseId: 3,
      name: 'Office Chairs',
      quantity: 75,
      category: 'Furniture',
      price: 129.99,
      addedDate: new Date(2023, 5, 10),
      expirationDate: undefined
    }
  ];

  constructor() { }

  // Warehouse methods
  getWarehouses(): Observable<Warehouse[]> {
    return of(this.warehouses).pipe(delay(500));
  }

  getWarehouseById(id: number): Observable<Warehouse | undefined> {
    const warehouse = this.warehouses.find(w => w.id === id);
    return of(warehouse).pipe(delay(500));
  }

  addWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    const newWarehouse = {
      ...warehouse,
      id: this.generateWarehouseId(),
      createdDate: new Date()
    };
    this.warehouses.push(newWarehouse);
    return of(newWarehouse).pipe(delay(500));
  }

  updateWarehouse(warehouse: Warehouse): Observable<Warehouse> {
    const index = this.warehouses.findIndex(w => w.id === warehouse.id);
    if (index !== -1) {
      this.warehouses[index] = warehouse;
    }
    return of(warehouse).pipe(delay(500));
  }

  deleteWarehouse(id: number): Observable<boolean> {
    const index = this.warehouses.findIndex(w => w.id === id);
    if (index !== -1) {
      this.warehouses.splice(index, 1);
      // Also delete all items from this warehouse
      this.warehouseItems = this.warehouseItems.filter(item => item.warehouseId !== id);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  // Warehouse Item methods
  getWarehouseItems(warehouseId: number): Observable<WarehouseItem[]> {
    const items = this.warehouseItems.filter(item => item.warehouseId === warehouseId);
    return of(items).pipe(delay(500));
  }

  getItemById(id: number): Observable<WarehouseItem | undefined> {
    const item = this.warehouseItems.find(item => item.id === id);
    return of(item).pipe(delay(500));
  }

  addItem(item: WarehouseItem): Observable<WarehouseItem> {
    const newItem = {
      ...item,
      id: this.generateItemId(),
      addedDate: new Date()
    };
    this.warehouseItems.push(newItem);
    return of(newItem).pipe(delay(500));
  }

  updateItem(item: WarehouseItem): Observable<WarehouseItem> {
    const index = this.warehouseItems.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.warehouseItems[index] = item;
    }
    return of(item).pipe(delay(500));
  }

  deleteItem(id: number): Observable<boolean> {
    const index = this.warehouseItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.warehouseItems.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }

  // Helper methods for generating IDs
  private generateWarehouseId(): number {
    return Math.max(0, ...this.warehouses.map(w => w.id || 0)) + 1;
  }

  private generateItemId(): number {
    return Math.max(0, ...this.warehouseItems.map(item => item.id || 0)) + 1;
  }
}
