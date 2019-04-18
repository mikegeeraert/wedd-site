import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Member } from '../../member';
import {BehaviorSubject, Observable, timer} from 'rxjs';
import {debounce, switchMap} from 'rxjs/internal/operators';


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css']
})
export class GuestListComponent implements OnInit {

  dataSource: Observable<Member[]>;
  displayedColumns: string[] = ['first', 'last', 'coming'];

  searchTerm = new BehaviorSubject('');


  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    // TODO: hook up the search term
    this.dataSource = this.firestoreService.listMembers('');
  }

  search(term: string) {
    this.searchTerm.next(term)
  }

}
