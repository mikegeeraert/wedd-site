import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Member } from '../../member';
import {BehaviorSubject, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css']
})
export class GuestListComponent implements OnInit {

  dataSource: Observable<Member[]>;
  displayedColumns: string[] = ['first', 'last', 'coming', 'rsvp-link'];

  searchTerm$$ = new BehaviorSubject('');
  searchTerm: string;


  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.dataSource = this.searchTerm$$.pipe(
      switchMap(searchTerm => this.firestoreService.listMembers(searchTerm)),
    )
  }

  search() {
    this.searchTerm$$.next(this.searchTerm)
  }

  formatRsvpLink(member: Member): string {
    return member.email ? `https://geeraertwedding.ca/authenticate?email=${member.email}&householdId=${member.householdId}` : '';
  }

}
