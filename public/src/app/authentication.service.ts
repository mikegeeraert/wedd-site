import { Injectable } from '@angular/core';
import { Functions } from 'firebase/functions';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  functions: Functions;

  constructor() {}

  initialize(functions: Functions) {
    this.functions = functions;
  }

  authCredentials(emailAddress: string, householdId: string): Observable<string> {
    console.log('Calling Cloud Function with credentials');
    console.log(emailAddress + householdId);
    const authFunction = this.functions.httpsCallable('emailAuthentication');
    const result = authFunction(
        {emailAddress: emailAddress, householdId: householdId}
      ).catch(error => {
      throw new this.functions.https.HttpsError('unknown', error.message, error)
    });
    return fromPromise(result) // return the auth token from the cloud function
  }
}
