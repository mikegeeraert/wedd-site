import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Member } from '../../member';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css']
})
export class GuestListComponent implements OnInit {

  dataSource: Observable<Member[]>;
  displayedColumns: string[] = ['first', 'last', 'coming'];


  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.dataSource = this.firestoreService.getMembers()
  }



}
