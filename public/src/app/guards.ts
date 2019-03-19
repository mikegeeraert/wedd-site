import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/internal/operators';

@Injectable()
export class CanViewRSVP implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const params = route.queryParams;
    return this.authenticationService.user.pipe(
      map( user => {
          console.log(route.queryParams);
          return user ?
            true :
            this.router.createUrlTree(['authenticate'], {
              queryParams: {
                email: params.email,
                householdId: params.householdId
              }
            });
        }
      )
    )
  }

  private attemptSignIn(email: string, householdId: string): Observable<boolean> {
    const createAuthToken$ = this.authenticationService.generateAuthToken(email, householdId);
    return createAuthToken$.pipe(
      switchMap(token => this.authenticationService.signInWithAuthToken(token)),
      catchError(error => {console.error(`Authentication Failed ${error.toString()}`); return of(false);}),
      mapTo(true)
    );
  }
}


