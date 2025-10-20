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

  // New computed properties for token metadata
  tokenExpiryTime = computed<Date | null>(() => {
    const t = this._token();
    if (!t) return null;
    return this.jwt.getTokenExpirationDate(t);
  });

  tokenIssuedAt = computed<Date | null>(() => {
    const t = this._token();
    if (!t) return null;
    try {
      const decoded = this.jwt.decodeToken(t);
      return decoded?.iat ? new Date(decoded.iat * 1000) : null;
    } catch {
      return null;
    }
  });

  tokenSubject = computed<string | null>(() => {
    const t = this._token();
    if (!t) return null;
    try {
      const decoded = this.jwt.decodeToken(t);
      return decoded?.sub || null;
    } catch {
      return null;
    }
  });

  tokenIssuer = computed<string | null>(() => {
    const t = this._token();
    if (!t) return null;
    try {
      const decoded = this.jwt.decodeToken(t);
      return decoded?.iss || null;
    } catch {
      return null;
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
      const expDate = this.jwt.getTokenExpirationDate(token);

      if (!expDate) {
        return;
      }

      const msUntilExpiry = expDate.getTime() - Date.now();

      if (msUntilExpiry > 0) {
        clearTimeout(this.expirationTimer);
        this.expirationTimer = setTimeout(() => {
          this._token.set(null);
          localStorage.removeItem('jwt_token');
          this.router.navigate(['/login']);
        }, msUntilExpiry);
      } else {
        this.logout();
      }
    } catch (err) {
      console.error('scheduleTokenExpiry error:', err);
      this.logout();
    }
  }
}