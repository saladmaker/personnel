import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

import { Role } from '../../models/role.model';
import { LoginCreateRequest } from '../../models/login-create-request.model';
import { UsersService } from '../../services/users.service';

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  roles: Role[];
}

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    MultiSelectModule,
    ButtonModule,
  ],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent implements OnInit {
  createUserForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  roles: Role[] = ['admin', 'user'];

  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      roles: this.fb.control<Role[]>([], [Validators.required]),
    });
  }

  get f() {
    return this.createUserForm.controls as Record<keyof CreateUserForm, any>;
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: LoginCreateRequest = this.createUserForm.value as LoginCreateRequest;

    this.userService
      .createUser(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage = "Utilisateur créé avec succès.";
          this.createUserForm.reset();
        },
        error: () => {
          this.errorMessage = "Erreur lors de la création de l'utilisateur.";
        },
      });
  }
}
