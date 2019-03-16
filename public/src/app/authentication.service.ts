import { Injectable } from '@angular/core';
import { Functions } from 'firebase/functions';
import { Auth } from 'firebase/auth';
import {from, Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  auth: Auth;
  functions: Functions;

  constructor() {}

  initialize(auth : Auth, functions: Functions) {
    this.auth = auth;
    this.functions = functions;
  }

  generateAuthToken(emailAddress: string, householdId: string): Observable<string> {
    console.log('Calling Cloud Function with credentials');
    console.log(emailAddress + householdId);
    const authFunction = this.functions.httpsCallable('authenticateWithEmail');
    const result = authFunction({emailAddress: emailAddress, householdId: householdId}).
      then(result => result.data.token).
      catch(error => {
        throw new Error(`Failed to authenticate - ${error.toString()}`)
      });
    return from(result);
  }

  signInWithAuthToken(token: string): Observable<any> {
    return this.auth.signInWithCustomToken(token)
  }

  isGuestSignedIn(): boolean {
    console.log(this.auth);
    return !!this.auth.currentUser;
  }

}
