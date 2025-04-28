import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Mock users for demonstration
  private users: User[] = [
    { id: 1, email: 'admin@happywarehouse.com', fullName: 'Admin User', role: UserRole.Admin, active: true },
    { id: 2, email: 'manager@happywarehouse.com', fullName: 'Manager User', role: UserRole.Management, active: true },
    { id: 3, email: 'auditor@happywarehouse.com', fullName: 'Auditor User', role: UserRole.Auditor, active: true },
    { id: 4, email: 'manager2@happywarehouse.com', fullName: 'Second Manager', role: UserRole.Management, active: false }
  ];

  constructor() { }

  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(500)); // Simulate API delay
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find(u => u.id === id);
    return of(user).pipe(delay(500)); // Simulate API delay
  }

  addUser(user: User): Observable<User> {
    const newUser = {
      ...user,
      id: this.generateId()
    };
    this.users.push(newUser);
    return of(newUser).pipe(delay(500)); // Simulate API delay
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return of(user).pipe(delay(500)); // Simulate API delay
  }

  deleteUser(id: number): Observable<boolean> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(true).pipe(delay(500)); // Simulate API delay
    }
    return of(false).pipe(delay(500)); // Simulate API delay
  }

  private generateId(): number {
    // Simple ID generation - find max ID and add 1
    return Math.max(0, ...this.users.map(user => user.id || 0)) + 1;
  }
}
