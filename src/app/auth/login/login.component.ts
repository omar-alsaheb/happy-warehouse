import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize the login form with validation
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Redirect to welcome page if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/welcome']);
    }
  }

  // Convenience getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } { 
    return this.loginForm.controls; 
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          // Navigate to welcome page on successful login
          this.router.navigate(['/welcome']);
        },
        error: error => {
          this.error = error.message || 'Invalid email or password';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
