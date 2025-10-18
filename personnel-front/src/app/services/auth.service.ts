// src/app/services/auth.service.ts

import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest } from '../models/login-request.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Stores the JWT in memory.
  token = signal<string | null>(null);

  // Use functional inject() inside the service
  private jwt = inject(JwtHelperService);
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'http://localhost:8080/api';
  private expirationTimer: any; // To hold the timeout reference

  // --- Computed Properties ---

  isAuthenticated = computed(() => {
    const t = this.token();
    // Use the library's check for expiration
    return !!t && !this.jwt.isTokenExpired(t);
  });

  // SmallRye JWT uses the 'groups' claim for roles/groups by standard.
  groups = computed<string[]>(() => {
    const t = this.token();
    if (!t) return [];
    try {
        const decoded = this.jwt.decodeToken(t);
        // Ensure it returns an array, defaulting to an empty array
        const groups = decoded?.['groups'];
        return Array.isArray(groups) ? groups : (groups ? [groups] : []);
    } catch (e) {
        return [];
    }
  });

  // --- Methods ---

  hasGroup(requiredGroup: string): boolean {
    return this.groups().includes(requiredGroup);
  }

  hasAnyGroup(requiredGroups: string[]): boolean {
    return requiredGroups.some(group => this.groups().includes(group));
  }
  
  // Refactored login method
  login(request: LoginRequest) {
    // 1. Clear any existing timer before a new login attempt
    clearTimeout(this.expirationTimer);

    return this.http.post<string>(`${this.apiUrl}/login`, request, {
      responseType: 'text' as 'json'
    }).pipe(
      tap((token: string) => {
        this.token.set(token);
        this.scheduleTokenExpiry(token);
      })
    );
  }

  logout() {
    this.token.set(null);
    clearTimeout(this.expirationTimer); // Clear the timer on explicit logout
    this.router.navigate(['/login']);
  }

  // Extracted logic to manage the token expiration timer
  private scheduleTokenExpiry(token: string): void {
    // NOTE: Although the JWT library's isTokenExpired check is reliable, 
    // using a timer is still the best way to auto-logout the user exactly 
    // when the token becomes invalid on the client side.
    try {
      // Use the library's method to get the expiration date (more robust than manual parsing)
      const expirationDate = this.jwt.getTokenExpirationDate(token);
      
      if (!expirationDate) {
        console.warn('JWT token has no expiration date (exp claim). Auto-logout disabled.');
        return;
      }

      const msUntilExpiry = expirationDate.getTime() - Date.now();
      
      if (msUntilExpiry > 0) {
        console.log(`Scheduling logout in ${Math.round(msUntilExpiry / 1000)} seconds.`);
        // Set the timer to call logout()
        this.expirationTimer = setTimeout(() => this.logout(), msUntilExpiry);
      } else {
        // Token is already expired (e.g., system clock issues, token received late)
        console.warn('Token is already expired. Logging out immediately.');
        this.logout();
      }
    } catch (error) {
      console.error('Failed to schedule token expiry:', error);
      this.logout();
    }
  }
}