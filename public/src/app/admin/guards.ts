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
        // TODO: figure out the issue with switchMapping for the admin user in firestore
        const admins = ['mikegeeraert@gmail.com', 'trp545@gmail.com'];
        return admins.some(admin => admin === user.email)|| this.router.createUrlTree(['our-story'])})
    )
  }
}
