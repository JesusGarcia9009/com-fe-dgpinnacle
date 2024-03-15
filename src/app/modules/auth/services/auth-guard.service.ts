import { Injectable } from '@angular/core';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor() {
  }

  isAuthenticated(): boolean {
    if (sessionStorage.getItem('token')) { return true; }
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isAuthenticated()) {
        return true;
    }
    // navigate to login page
    location.hash = '/login';
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }

}