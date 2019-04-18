import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import {map, switchMap, tap} from 'rxjs/internal/operators';

@Injectable()
export class IsAdmin implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const user = this.authenticationService.user;
    return user.pipe(
      map(user => {
        // Assumption is that only users with email/password logins are admins
        return !!user.email || this.router.createUrlTree(['our-story'])})
    )
  }
}
