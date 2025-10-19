//src/app/auth.config.ts
export function tokenGetter() {
  return localStorage.getItem('jwt_token');
}
