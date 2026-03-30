import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, RoleUtilisateur } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  const requiredRoles = route.data['roles'] as Array<RoleUtilisateur>;
  if (!requiredRoles || requiredRoles.length === 0) return true;

  const userRole = authService.getUser()?.role;
  if (userRole && requiredRoles.includes(userRole)) return true;

  return router.createUrlTree(['/dashboard']);
};
