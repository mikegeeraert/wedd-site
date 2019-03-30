import { Injectable } from '@angular/core';
import { Functions } from 'firebase/functions';
import { Auth } from 'firebase/auth';
import {from, Observable, of, ReplaySubject} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
import * as firebase from 'firebase';
import {shareReplay, tap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  auth: Auth;
  functions: Functions;

  user$$ = new ReplaySubject<firebase.User>(1);
  user$ = this.user$$.asObservable();

  constructor() {}

  initialize(auth : Auth, functions: Functions) {
    this.auth = auth;
    this.functions = functions;
    this.auth.onAuthStateChanged(this.user$$);
  }

  generateAuthToken(emailAddress: string, householdId: string): Observable<string | null> {
    console.log(emailAddress + householdId);
    const authFunction = this.functions.httpsCallable('authenticateWithEmail');
    const result = authFunction({emailAddress: emailAddress, householdId: householdId}).
      then(result => result.data.token).
      catch(error => {
        console.error(`Failed to authenticate - ${error.toString()}`);
        return of(null);
      });
    return from(result as string);
  }

  signInWithAuthToken(token: string): Observable<void> {
    const result = this.auth.signInWithCustomToken(token);
    return fromPromise(result)
  }

  get user(): Observable<firebase.User> {
    return this.user$;
  }

}
