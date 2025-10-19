import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PasswordChangeRequest } from '../models/password-change-request.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly profileApiUrl = '/api/profile'; // matches Quarkus REST path

  constructor(private http: HttpClient) {}

  updatePassword(request: PasswordChangeRequest): Observable<void> {
    return this.http.post<void>(`${this.profileApiUrl}/updatePassword`, request);
  }
}
