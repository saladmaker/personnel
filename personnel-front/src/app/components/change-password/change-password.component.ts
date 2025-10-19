import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { ProfileService } from '../../services/profile.service';
import { PasswordChangeRequest } from '../../models/password-change-request.model';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    PasswordModule,
    ButtonModule,
  ],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: this.fb.control('', [Validators.required]),
        newPassword: this.fb.control('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmNewPassword: this.fb.control('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator() } // ✅ correct use: call returns ValidatorFn
    );
  }

  get f() {
    return this.changePasswordForm.controls as Record<keyof ChangePasswordForm, any>;
  }

  /** ✅ clean, type-safe group-level validator */
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup;
      const newPass = form.get('newPassword')?.value;
      const confirm = form.get('confirmNewPassword')?.value;

      if (!newPass || !confirm) {
        return null;
      }

      return newPass !== confirm ? { mustMatch: true } : null;
    };
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) return;

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload: PasswordChangeRequest = {
      oldPassword: this.f.currentPassword.value,
      newPassword: this.f.newPassword.value,
    };

    this.profileService
      .updatePassword(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.successMessage = 'Mot de passe mis à jour avec succès.';
          this.changePasswordForm.reset();
        },
        error: (err) => {
          this.errorMessage =
            err.status === 401
              ? 'Ancien mot de passe incorrect.'
              : 'Erreur lors de la mise à jour du mot de passe.';
        },
      });
  }
}
