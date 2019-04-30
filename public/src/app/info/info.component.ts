import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {AuthenticationService} from '../authentication.service';
import {Observable, of} from 'rxjs';
import {FirestoreService} from '../firestore.service';
import {switchMap} from 'rxjs/operators';
import {tap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  householdId: Observable<string>;

  constructor(@Inject(DOCUMENT) private document: Document,
              private userService: AuthenticationService,
              private storageService: FirestoreService) { }

  ngOnInit() {

    this.householdId = this.userService.user.pipe(
      switchMap(user => user ? this.storageService.getHouseholdIdForEmail(user.uid): of(null)),
    )
  }

  getDirections(name: string, placeID: string) {
    const args = `&destination=${name}&destination_place_id=${placeID}&dir_action=navigate`;
    const url = `https://www.google.com/maps/dir/?api=1${args}`;
    console.log(url);
    this.document.location.href = url;
  }
}
