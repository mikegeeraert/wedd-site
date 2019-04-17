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
}


