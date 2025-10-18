import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export function tokenGetter() {
  const auth = inject(AuthService);
  return auth.token(); // read signal value
}
