import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, mapTo, switchMap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(true);

  constructor(private authenticationService: AuthenticationService, private route : ActivatedRouteSnapshot) { }

  ngOnInit() {
    const params = this.route.queryParams;
    this.attemptSignIn(params.emails, params.householdId).subscribe(success => {
      if (success) {

      }
    });
  }

  private attemptSignIn(email: string, householdId: string): Observable<boolean> {
    const createAuthToken$ = this.authenticationService.generateAuthToken(email, householdId);
    return createAuthToken$.pipe(
      switchMap(token => this.authenticationService.signInWithAuthToken(token)),
      catchError(error => {console.error(`Authentication Failed ${error.toString()}`); return of(false);}),
      mapTo(true),
    );
  }

}
