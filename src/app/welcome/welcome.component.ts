import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User, UserRole } from '../models/user.model';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  isManager = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Get the current user
    this.currentUser = this.authService.getCurrentUser();
    
    // Check if not logged in, redirect to login page
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Set user role flags for UI display
    this.isAdmin = this.currentUser.role === UserRole.Admin;
    this.isManager = this.currentUser.role === UserRole.Management;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
