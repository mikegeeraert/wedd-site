import { Injectable } from '@angular/core';
import { Functions } from 'firebase/functions';
import {from, Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
import {map, tap} from 'rxjs/internal/operators';
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
    const authFunction = this.functions.httpsCallable('authenticateWithEmail');
    const result = authFunction({emailAddress: emailAddress, householdId: householdId}).
      then(result => result.data.token).
      catch(error => {
        throw new Error(`Failed to authenticate - ${error.toString()}`)
      });
    return from(result);
  }
}
