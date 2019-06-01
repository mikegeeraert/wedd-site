import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Observable } from 'rxjs';
import { Household } from '../../household';
import * as moment from 'moment';
import {Member} from '../../member';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {tap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-household-list',
  templateUrl: './household-list.component.html',
  styleUrls: ['./household-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseholdListComponent implements OnInit {

  dataSource: Observable<Household[]>;
  displayedColumns: string[] = ['name', 'first', 'coming', 'missing', 'response', 'time'];

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

  formatSongList(songs: string[]): string {
    return songs.join(', ');

  }

  numAttending(household: Household): number {
    return household.response ? household.attending().length : null;
  }

  numMissing(household: Household): number {
    return household.response ? household.missing().length : null;
  }

  hasDietaryRestrictions(household: Household): boolean {
    if (Array.isArray(household.dietaryRestrictions)) {
      return !!household.dietaryRestrictions.length;
    } else {
      return household.dietaryRestrictions !== null && household.dietaryRestrictions !== '';
    }
  }

  setHouseholdResponseTime(householdId: string, time: string) {
    this.firestoreService.setHouseholdResponseTime(householdId, moment(time, 'MMMM Do YYYY, h:mm:ss a'));
  }
}
