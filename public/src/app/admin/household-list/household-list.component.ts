import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Observable } from 'rxjs';
import { Household } from '../../household';
import * as moment from 'moment';
import {Member} from '../../member';

@Component({
  selector: 'app-household-list',
  templateUrl: './household-list.component.html',
  styleUrls: ['./household-list.component.css']
})
export class HouseholdListComponent implements OnInit {

  dataSource: Observable<Household[]>;
  displayedColumns: string[] = ['name', 'first', 'response'];


  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.dataSource = this.firestoreService.listHouseholds();
  }

  formatResponseDate(response: moment.Moment): string {
    return response ? response.format('MMMM Do YYYY, h:mm:ss a') : ' - ';
  }

  formatFirstNames(members: Member[]): string {
    return members.map(member => member.first).join(', ');
  }
}
