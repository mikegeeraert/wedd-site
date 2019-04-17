import { Injectable } from '@angular/core';
import { Functions } from 'firebase/functions';
import { Auth } from 'firebase/auth';
import {combineLatest, from, Observable, of, ReplaySubject} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/fromPromise';
import * as firebase from 'firebase';
import {shareReplay, tap} from 'rxjs/operators';
import {map, mapTo} from 'rxjs/internal/operators';
import {FirestoreService} from './firestore.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  auth: Auth;
  functions: Functions;

  user$$ = new ReplaySubject<firebase.User>(1);
  user$ = this.user$$.asObservable();

  constructor(private firestoreService: FirestoreService) {}

  initialize(auth : Auth, functions: Functions) {
    this.auth = auth;
    this.functions = functions;
    this.auth.onAuthStateChanged(this.user$$);
  }

  generateAuthToken(emailAddress: string, householdId: string): Observable<string | null> {
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

  adminLogin(email: string, password: string): Observable<boolean> {
    const signInResult = from(this.auth.signInWithEmailAndPassword(email, password));
    const isAdmin = this.isAdmin(email);
    return combineLatest(signInResult, isAdmin).pipe(
      map(([signInResult, isAdmin]) => signInResult && isAdmin)
    )
  }

  isAdmin(email: string): Observable<boolean> {
    return this.firestoreService.getAdmin(email).pipe(mapTo(true))
  }

  get user(): Observable<firebase.User> {
    return this.user$;
  }

}
