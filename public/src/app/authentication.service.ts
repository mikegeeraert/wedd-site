import { Injectable } from '@angular/core';
import {combineLatest, from, Observable, of} from 'rxjs';
import * as firebase from 'firebase';
import {catchError, map, mapTo} from 'rxjs/operators';
import {FirestoreService} from './firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireFunctions } from '@angular/fire/functions';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private firestoreService: FirestoreService,
              private auth: AngularFireAuth,
              private functions: AngularFireFunctions) {}

  generateAuthToken(emailAddress: string, householdId: string): Observable<string | null> {
    const authFunction = this.functions.httpsCallable('authenticateWithEmail');
    return authFunction({emailAddress: emailAddress, householdId: householdId}).pipe(
      map(result => result.token),
      catchError(error => {
        console.error(`Failed to authenticate - ${error.toString()}`);
        return of(null);
      })
    );
  }

  signInWithAuthToken(token: string): Observable<firebase.auth.UserCredential> {
    const result = this.auth.auth.signInWithCustomToken(token);
    return from(result);
  }

  adminLogin(email: string, password: string): Observable<boolean> {
    const signInResult = from(this.auth.auth.signInWithEmailAndPassword(email, password));
    const isAdmin = this.isAdmin(email);
    return combineLatest(signInResult, isAdmin).pipe(
      map(([signInResult, isAdmin]) => signInResult && isAdmin)
    );
  }

  isAdmin(email: string): Observable<boolean> {
    return this.firestoreService.getAdmin(email).pipe(mapTo(true))
  }

  get user(): Observable<firebase.User> {
    return this.auth.user;
  }

}
