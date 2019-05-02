import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';

import { FirestoreService } from "./firestore.service";
import { MediaMatcher } from "@angular/cdk/layout";
import { AuthenticationService } from './authentication.service';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  userHouseholdId$: Observable<string>;


  constructor(private firestoreService: FirestoreService,
              private authenticationService: AuthenticationService,
              changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit(): void {
    this.userHouseholdId$ = this.authenticationService.user.pipe(
      switchMap(user => !!user ? this.firestoreService.getHouseholdIdForEmail(user.uid): of(null))
    )

  }

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
