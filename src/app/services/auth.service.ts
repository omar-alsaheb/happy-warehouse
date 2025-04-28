import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { delay, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Mock users for demonstration
  private mockUsers: User[] = [
    { id: 1, email: 'admin@happywarehouse.com', fullName: 'Admin User', role: UserRole.Admin, active: true, password: 'admin123' },
    { id: 2, email: 'manager@happywarehouse.com', fullName: 'Manager User', role: UserRole.Management, active: true, password: 'manager123' },
    { id: 3, email: 'auditor@happywarehouse.com', fullName: 'Auditor User', role: UserRole.Auditor, active: true, password: 'auditor123' }
  ];

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulate API call with delay
    return of(this.mockUsers.find(user => 
      user.email === email && user.password === password && user.active
    )).pipe(
      delay(800),
      map(user => {
        if (!user) {
          throw new Error('Invalid email or password');
        }
        return user;
      }),
      tap(user => {
        // Store user details and set current user
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword);
      })
    );
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}
