import { Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import {forkJoin, from, merge, Observable} from 'rxjs';
import { Household } from './household';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import {tap} from 'rxjs/internal/operators';
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
      map((result: firebase.firestore.DocumentSnapshot) => new Household(result.data()))
    );

    const members = from(membersRef.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        const membersObjs = [];
        results.forEach(result => membersObjs.push(new Member(result.data())));
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
