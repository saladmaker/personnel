import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule, 
    InputTextModule, 
    PasswordModule, 
    ButtonModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  providers: [MessageService] 
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService); // Inject the AuthService
  private messageService = inject(MessageService); // Inject MessageService for toast

  // Initialize the login form with validation
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  loading: boolean = false;

  onSubmit() {
    this.loading = true;
    
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      const request: LoginRequest = { 
          email: username, 
          password: password 
      };

      this.authService.login(request)
        .pipe(
          catchError(error => {
            // Handle HTTP error (e.g., 401 Unauthorized, 500 Internal Server Error)
            console.error('Login failed', error);
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Login Failed', 
                detail: 'Invalid credentials or server error.' 
            });
            this.loading = false;
            return of(null);
          })
        )
        .subscribe(token => {
          this.loading = false;
          
          if (token) {

            this.messageService.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: 'Login successful!' 
            });
            
            // Navigate to the home page after successful login
            this.router.navigate(['/home']); 
          }
        });

    } else {
      this.loginForm.markAllAsTouched();
      this.loading = false;
    }
  }

  get f() { return this.loginForm.controls; }
}