import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AdminLogin } from '../../../models/admin-login';

@Component({
  selector: 'app-admin-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-login.component.html',

  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {

  credentials: AdminLogin = {
    username: '',
    password: ''
  };

  errorMessage = '';

  isLoggingIn = false;


  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // send the user back to the home page instead of bouncing between admin routes
  @HostListener('window:popstate')
  onBrowserBack(): void {

    this.router.navigate(['/']);

  }


  login(): void {

    this.errorMessage = '';

    this.isLoggingIn = true;


    this.authService
      .login(this.credentials)
      .subscribe({

        next: (response) => {

          console.log(
            'Login successful:',
            response.message
          );

          this.isLoggingIn = false;

          this.router.navigate([
            '/admin/dashboard'
          ]);

        },


        error: (error) => {

          console.error(
            'Login failed:',
            error
          );

          this.errorMessage =
            'Invalid username or password.';

          this.isLoggingIn = false;

        }

      });

  }

}