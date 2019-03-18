import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import {catchError, map, mapTo, switchMap, tap} from 'rxjs/internal/operators';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';

@Injectable()
export class CanViewRSVP implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authenticationService.user.pipe(
      map( user => user ? true : false)
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


