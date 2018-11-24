import { Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { Household } from './household';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

const HOUSEHOLD = 'household';

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
    const docRef = this.firestore.collection(HOUSEHOLD).doc(id);
    const household = from(docRef.get()).pipe(
      map((result: firebase.firestore.DocumentSnapshot) => new Household(result.data))
    );
    return household;
  }
}
