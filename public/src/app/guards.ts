import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {catchError, map, switchMap} from 'rxjs/internal/operators';

@Injectable()
export class CanViewRSVP implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const params = route.queryParams;
    console.log('Guard Received Params: ');
    console.log(params);
    return this.authenticationService.authCredentials(params.email, params.householdId).pipe(
      catchError(() => of(false)),
      map(token => {
        console.log(token);
        return true;
      })
    )
  }
}
