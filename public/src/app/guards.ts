import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import {catchError, mapTo, switchMap, tap} from 'rxjs/internal/operators';

@Injectable()
export class CanViewRSVP implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log("checking auth");
    if (this.authenticationService.isGuestSignedIn()) {
      console.log("no need to sign in");
      return of(true)
    }
    else {
      const params = route.queryParams;
      return this.attemptSignIn(params.email, params.householdId).pipe(
        tap(result => console.log(result)),
        mapTo(true)
      );
    }
  }

  private attemptSignIn(email: string, householdId: string): Observable<any> {
    const createAuthToken$ = this.authenticationService.generateAuthToken(email, householdId)
    return createAuthToken$.pipe(
      switchMap(token => this.authenticationService.signInWithAuthToken(token)),
      catchError(error => {console.error(`Authentication Failed ${error.toString()}`); return of(false);})
    );
  }
}


