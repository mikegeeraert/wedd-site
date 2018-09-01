import { Injectable } from '@angular/core';
import { Firestore } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore;

  constructor() { }

  initialize (db: Firestore) {
    this.firestore = db;
  }
}
