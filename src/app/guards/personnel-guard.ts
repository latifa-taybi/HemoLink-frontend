import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, RoleUtilisateur } from '../services/auth';

export const personnelGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const user = auth.getUser();

  console.log('[personnelGuard] Utilisateur actuel :', user);
  
  // On autorise PERSONNEL_CENTRE, mais aussi ADMIN pour faciliter vos tests !
  if (user && (user.role === RoleUtilisateur.PERSONNEL_CENTRE || user.role === RoleUtilisateur.ADMIN)) {
    console.log('[personnelGuard] Accès autorisé. Rôle:', user.role);
    return true;
  }
  
  console.warn('[personnelGuard] Accès refusé. Rôle attendu : PERSONNEL_CENTRE. Rôle actuel :', user?.role);
  router.navigate(['/auth/login']);
  return false;
};
