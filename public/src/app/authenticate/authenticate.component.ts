import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, mapTo, switchMap} from 'rxjs/internal/operators';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(true);

  constructor(private authenticationService: AuthenticationService,
              private route : ActivatedRoute,
              private router : Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.attemptSignIn(params.email, params.householdId).subscribe(success => {
      if (!success) {
        this.snackBar.open('Unable to determine who you are. Why are you being so sneaky!', 'Error',
          {
            duration: 4000,
          });
      }
      this.router.navigate(['our-story']);
    });
  }

  private attemptSignIn(email: string, householdId: string): Observable<boolean> {
    const createAuthToken$ = this.authenticationService.generateAuthToken(email, householdId).pipe(
      catchError(() =>  of(''))
    );
    return createAuthToken$.pipe(
      switchMap(token => this.authenticationService.signInWithAuthToken(token)),
      mapTo(true),
      catchError(error => {
        console.error(`Authentication Failed ${error.toString()}`);
        return of(false);
      }),
    );
  }

}
