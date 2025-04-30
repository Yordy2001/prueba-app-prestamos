import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = localStorage.getItem('user');
    const userData = user ? JSON.parse(user) : null;

    if (!userData) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as string[];
    if (expectedRoles && !expectedRoles.includes(userData.rol)) {
      this.router.navigate(['/no-autorizado']);
      return false;
    }

    return true;
  }
}