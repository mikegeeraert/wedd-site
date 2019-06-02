import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import {BehaviorSubject, interval, Observable, Subject} from 'rxjs';
import {Household, ListHouseholdsFilters} from '../../household';
import * as moment from 'moment';
import {Member} from '../../member';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {map, switchMap, tap, distinctUntilChanged, shareReplay, startWith} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';

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
  filterTokens: string[] = [];
  filtersTokens$$ = new Subject<string[]>();

  dataSource: Observable<Household[]>;
  totalComing$: Observable<number>;
  totalMissing$: Observable<number>;
  displayedColumns: string[] = ['name', 'first', 'response', 'coming', 'missing'];

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.dataSource = this.filtersTokens$$.pipe(
      startWith([]),
      map(filterTokens => this.filterTokensToFilters(filterTokens)),
      distinctUntilChanged(this.areFilterTokenListsDistinct),
      switchMap(filters => this.firestoreService.listHouseholds(filters)),
      shareReplay(1),
    );

    this.totalComing$ = this.dataSource.pipe(
      map(households => households.reduce((acc, household) => acc + this.numAttending(household), 0)),
    );
    this.totalMissing$ = this.dataSource.pipe(
      map(households => households.reduce((acc, household) => acc + this.numMissing(household), 0)),
    );
  }

  search() {
    this.filtersTokens$$.next(this.filterTokens);
  }

  filterTokensToFilters(filterTokens: string[]): ListHouseholdsFilters {
    const filters = {accommodation: null, name: null};
    filterTokens.forEach(token => {
      const tokenComponents = token.split(':');
      if (tokenComponents.length < 2) {
        return;
      }
      if (tokenComponents[0] === 'accommodation') {
        filters.accommodation = tokenComponents[1];
      }
      if (tokenComponents[0] === 'name') {
        filters.name = tokenComponents[1];
      }
    });
    return filters;
  }

  areFilterTokenListsDistinct(p: ListHouseholdsFilters, q: ListHouseholdsFilters ): boolean {
    return p.name === q.name && p.accommodation === q.accommodation;
  }

  formatResponseDate(response: moment.Moment): string {
    return response ? response.format('MMMM Do, h:mm a') : ' - ';
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
