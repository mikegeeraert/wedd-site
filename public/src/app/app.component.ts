import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import * as firebase from 'firebase';

import { FirestoreService } from "./firestore.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Taylor and Michael\'s Wedding';
  mobileQuery: MediaQueryList;


  constructor(private firestoreService: FirestoreService,
              private authenticationService: AuthenticationService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit(): void {
    const config = {
      apiKey: 'AIzaSyDMkKlFGyTslQ8Yo30mpO2vhXwirpkv2hE',
      authDomain: 'wedding-49e7e.firebaseapp.com',
      databaseURL: 'https://wedding-49e7e.firebaseio.com',
      projectId: 'wedding-49e7e',
      storageBucket: 'wedding-49e7e.appspot.com',
      messagingSenderId: '995005427485'
    };
    firebase.initializeApp(config);
    const db = firebase.firestore();
    db.settings({timestampsInSnapshots: true}); // To avoid breaking changes
    this.firestoreService.initialize(db);
    const functions = firebase.functions();
    this.authenticationService.initialize(functions); //pass reference to firebase functions to auth service
  }

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
