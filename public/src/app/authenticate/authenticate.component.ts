import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import {interval, Observable, of} from 'rxjs';
import {catchError, mapTo, switchMap, map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {
  loadingMessage$: Observable<string>;

  loadingMessages = [
    'checking guest list',
    'evaluating relationship',
    'consulting turkish monks',
    'theoretically calculating formulas',
    'resolving world hunger',
    'retrieving 18 billionth digit of pi',
  ];

  constructor(private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.loadingMessage$ = interval(1500).pipe(
      // Take modulo of i so we repeat list
      map(i => this.loadingMessages[i % this.loadingMessages.length])
    );


    this.attemptSignIn(params.email, params.householdId).subscribe(
    success => {
        if (!success) {
          this.errorSnack();
        }
      },
      () => this.errorSnack(),
      () => {
        this.router.navigate(['our-story']);
      }
    );
  }

  private errorSnack() {
    this.snackBar.open('Unable to determine who you are. Contact Michael or Taylor!', 'Error',
      {
        duration: 4000,
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
