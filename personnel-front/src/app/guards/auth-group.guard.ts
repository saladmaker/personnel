import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Ensures the user is authenticated and possesses AT LEAST ONE of the required groups.
 * Route Usage: { path: 'admin', canActivate: [groupGuard], data: { groups: ['Admin', 'SuperUser'] } }
 */
export const groupGuard: CanActivateFn = (route): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1. Check Authentication first. If not authenticated, redirect to login.
  if (!auth.isAuthenticated()) {
    // Use the authGuard's typical redirect destination
    return router.parseUrl('/login'); 
  }
  
  // 2. Get the array of required groups from the route's data property
  const requiredGroups = route.data['groups'] as string[];

  // If the route has no groups defined, assume only authentication is required (should use authGuard instead)
  if (!requiredGroups || requiredGroups.length === 0) {
    return true; 
  }

  // 3. Check if the authenticated user has any of the required groups
  if (auth.hasAnyGroup(requiredGroups)) {
    return true;
  }

  // 4. User is logged in but not authorized. Redirect to a forbidden/unauthorized page.
  return router.parseUrl('/forbidden');
};