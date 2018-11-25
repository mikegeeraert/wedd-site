import { Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import {forkJoin, from, merge, Observable, of, throwError} from 'rxjs';
import { Household } from './household';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import {switchMap, tap} from 'rxjs/internal/operators';
import {Member} from './member';

const HOUSEHOLDS = 'households';
const MEMBERS = 'members';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore;

  constructor() { }

  initialize (db: Firestore) {
    this.firestore = db;
  }

  getHousehold(id: string): Observable<Household> {
    const householdRef = this.firestore.collection(HOUSEHOLDS).doc(id);
    const membersRef = householdRef.collection(MEMBERS);

    const household = from(householdRef.get()).pipe(
      map((result: firebase.firestore.DocumentSnapshot) => {
        let householdObj: Household;
        if (result.exists) {
          householdObj = new Household(result.data());
        } else {
          throw new Error('NotFound: Household');
        }
        return householdObj;
      })
    );

    const members = from(membersRef.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        const membersObjs = [];
        if (!results.empty) {
          results.forEach(result => membersObjs.push(new Member(result.data())));
        } else {
          throw new Error('NotFound: Household Members');
        }
        return membersObjs;
      })
    );

    const joinedResults = forkJoin(household, members).pipe(
      map(result => {
        console.log(result);
        result[0].members = result[1];
        return result[0];
      })
    );

    return joinedResults;
  }
}
