import {Component, OnInit} from '@angular/core';

import * as firebase from 'firebase';
import { firestore } from 'firebase/app'
import {FirestoreService} from "./firestore.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'wedd-site';
  constructor(private firestoreService: FirestoreService) {}


  ngOnInit(): void {
    firebase.initializeApp({
      apiKey: 'AIzaSyCBdWiutvUMnzw-uqEtRt1RsGrc9MPzqDk',
      authDomain: 'wedd-site.firebaseapp.com',
      databaseURL: 'https://wedd-site.firebaseio.com',
      projectId: 'wedd-site',
      storageBucket: 'wedd-site.appspot.com',
      messagingSenderId: '469140619713'
    });
    const db = firebase.firestore();
    this.firestoreService.initialize(db);

  }
}
