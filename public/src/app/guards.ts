import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { catchError, mapTo, switchMap } from 'rxjs/internal/operators';

@Injectable()
export class CanViewRSVP implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const params = route.queryParams;
    const createAuthToken$ = this.authenticationService.generateAuthToken(params.email, params.householdId);
    const logInWithToken$ = createAuthToken$.pipe(
      switchMap(token => this.authenticationService.signInWithAuthToken(token))
    );

    return combineLatest(createAuthToken$, logInWithToken$).pipe(
      catchError(error => {console.log(`Authentication Failed ${error.toString()}`); return of(false);}),
      mapTo(true)
    )
  }
}
