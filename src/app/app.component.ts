import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import * as firebase from 'firebase';
import { firestore } from 'firebase/app'
import {FirestoreService} from "./firestore.service";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Taylor and Michael\'s Wedding';
  mobileQuery: MediaQueryList;


  constructor(private firestoreService: FirestoreService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


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

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
