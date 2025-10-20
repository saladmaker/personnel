import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCreateRequest } from '../models/login-create-request.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly createApiUrl = 'http://localhost:8080/api/users'; 
  constructor(private http: HttpClient) {}

  createUser(request: LoginCreateRequest): Observable<void>{
    return this.http.post<void>(`${this.createApiUrl}/create`, request);
  }
}
