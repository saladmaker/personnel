//src/service/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginRequest } from '../models/login-request.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private jwt = inject(JwtHelperService);
  private router = inject(Router);

  private apiUrl = 'http://localhost:8080/api';
  private expirationTimer: any;

  // --- Signals ---
  private _token = signal<string | null>(localStorage.getItem('jwt_token'));

  // --- Computed properties ---
  token = computed(() => this._token());

  isAuthenticated = computed(() => {
    const t = this._token();
    return !!t && !this.jwt.isTokenExpired(t);
  });

  groups = computed<string[]>(() => {
    const t = this._token();
    if (!t) return [];
    try {
      const decoded = this.jwt.decodeToken(t);
      const groups = decoded?.['groups'];
      return Array.isArray(groups) ? groups : (groups ? [groups] : []);
    } catch {
      return [];
    }
  });

  // --- Methods ---
  hasGroup(requiredGroup: string): boolean {
    return this.groups().includes(requiredGroup);
  }

  hasAnyGroup(requiredGroups: string[]): boolean {
    return requiredGroups.some(g => this.groups().includes(g));
  }

  login(request: LoginRequest) {
    clearTimeout(this.expirationTimer);
    return this.http.post<string>(`${this.apiUrl}/users/login`, request, {
      responseType: 'text' as 'json'
    }).pipe(
      tap(token => {
        this.setToken(token);
        this.scheduleTokenExpiry(token);
        this.router.navigate(['/profile']);
      })
    );
  }

  logout() {
    this._token.set(null);
    localStorage.removeItem('jwt_token');
    clearTimeout(this.expirationTimer);
    this.router.navigate(['/login']);
  }

  private setToken(token: string) {
    this._token.set(token);
    localStorage.setItem('jwt_token', token);
  }

  private scheduleTokenExpiry(token: string) {
    try {
      const decoded = this.jwt.decodeToken(token);
      const expClaim = decoded?.exp;
      console.log('[JWT DEBUG] Raw exp claim:', expClaim);

      const expDate = this.jwt.getTokenExpirationDate(token);
      console.log('[JWT DEBUG] Expiration date:', expDate?.toISOString());
      console.log('[JWT DEBUG] Current date:', new Date().toISOString());

      if (!expDate) {
        console.warn('[JWT DEBUG] No expiration date detected.');
        return;
      }

      const msUntilExpiry = expDate.getTime() - Date.now();
      console.log('[JWT DEBUG] msUntilExpiry:', msUntilExpiry);

      if (msUntilExpiry > 0) {
        clearTimeout(this.expirationTimer);
        this.expirationTimer = setTimeout(() => {
          console.log('[JWT DEBUG] Token expired — clearing.');
          this._token.set(null);
          localStorage.removeItem('jwt_token');
          this.router.navigate(['/login']);
        }, msUntilExpiry);
      } else {
        console.warn('[JWT DEBUG] Token already expired — logging out.');
        this.logout();
      }
    } catch (err) {
      console.error('[JWT DEBUG] scheduleTokenExpiry error:', err);
      this.logout();
    }
  }


}
