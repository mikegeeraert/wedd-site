import { Injectable } from '@angular/core';
import {combineLatest, forkJoin, from, Observable, of} from 'rxjs';
import { Household } from './household';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Member, MemberType, PlusOne } from './member';
import { RsvpStatistics } from './statistics';
import { AngularFirestore } from '@angular/fire/firestore';

import {Admin} from './admin';
import {AngularFireFunctions} from '@angular/fire/functions';
import * as moment from 'moment';

const HOUSEHOLDS = 'households';
const GUESTS = 'guests';
const ADMINS = 'admins';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private functions: AngularFireFunctions) { }

  getHouseholdIdForEmail(email: string): Observable<string | null> {
    const guestsRef = this.firestore.collection(GUESTS, ref => ref.where('email', '==', email).limit(1));
    return from(guestsRef.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        let householdId: string = null;
        if (!results.empty) {
          results.forEach(result => householdId = result.data().householdId); // since query limit is 1, this loops once
        }
        return householdId;
      }),
    );
  }

  listMembers(searchTerm: string): Observable<Member[]> {
    // Build Members query
    let members: Observable<Member[]>;

    // if no search term, return all guests
    if (searchTerm === '') {
      members = this.firestore.collection(GUESTS,
        ref => ref.where('type', '==', MemberType.invitee.valueOf())
      ).get().pipe(
        map(results => this.fillMembersList(results))
      );
    } else {
    // if search term, return guests with full match on first or last name
      const firstMatch = this.firestore.collection(GUESTS, ref => ref.
      where('type', '==', MemberType.invitee.valueOf()).
      where('first', '==', searchTerm));

      const lastMatch = this.firestore.collection(GUESTS, ref => ref.
      where('type', '==', MemberType.invitee.valueOf()).
      where('last', '==', searchTerm));
      members = combineLatest(lastMatch.get(), firstMatch.get()).pipe(
        map(([lastMatch, firstMatch]) => {
          const results = this.fillMembersList(lastMatch);
          results.push(...this.fillMembersList(firstMatch));
          return results;
        })
      );
    }
    return members.pipe(
      // Sort alphabetically by last name
      map((membersObjs: Member[]) => membersObjs.sort((a, b) => a.last.localeCompare(b.last)))
    );
  }

  listHouseholds(): Observable<Household[]> {
    const households = this.firestore.collection(HOUSEHOLDS).get().pipe(
      map( result => this.fillHouseholdList(result))
    );
    const members = this.firestore.collection(GUESTS).get().pipe(
      map(result => this.fillMembersList(result))
    );
    return combineLatest([households, members]).pipe(
      map(([hs, ms]) => hs.map( household => this.sortMembersIntoHousehold(household, ms))),
      map(hs => hs.sort((a, b) => a.name.localeCompare(b.name)))

    );
  }

  setHouseholdResponseTime(householdId: string, time: moment.Moment) {
    const householdRef = this.firestore.collection(HOUSEHOLDS).doc(householdId);
    const result = householdRef.update({
      response: time.format(),
    });
  }

  getHousehold(id: string): Observable<Household> {
    const householdRef = this.firestore.collection(HOUSEHOLDS).doc(id);
    const membersRef = this.firestore.collection(GUESTS, ref => ref.
      where('householdId', '==', id).
      where('type', '==', MemberType.invitee.valueOf()
    ));
    const plusOnesRef = this.firestore.collection(GUESTS, ref => ref.
    where('householdId', '==', id).
    where('type', '==', MemberType.plusOne.valueOf()
    ));

    const household = householdRef.get().pipe(
      map((result: firebase.firestore.DocumentSnapshot) => {
        let householdObj: Household;
        if (result.exists) {
          householdObj = new Household(result.id, result.data());
        } else {
          throw new Error('NotFound: Household');
        }
        return householdObj;
      })
    );

    const members = membersRef.get().pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        const membersObjs = [];
        if (!results.empty) {
          results.forEach(result => membersObjs.push(new Member(result.id, result.data())));
        } else {
          throw new Error('NotFound: Household Members');
        }
        return membersObjs;
      })
    );

    const plusOnes = plusOnesRef.get().pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        const plusOneObjs = [];
        if (!results.empty) {
          results.forEach(result => plusOneObjs.push(new PlusOne(result.id, result.data())));
        }
        return plusOneObjs;
      })
    );

    return forkJoin(household, members, plusOnes).pipe(
      map(result => {
        // Put members on household
        result[0].members = result[1];
        // For each plus one, find their corresponding household member
        result[2].forEach((plusOne: PlusOne) => {
          const indexOfMember = result[0].members.findIndex((member: Member) => member.id === plusOne.parentId);
          if (indexOfMember > -1) {
            result[0].members[indexOfMember].plusOne = plusOne;
          }
        });
        return result[0];
      })
    );
  }

  updateHouseHold(household: Household): Observable<void> {
    const householdRef = this.firestore.collection(HOUSEHOLDS).doc(household.id);
    const result = householdRef.update({
      name: household.name,
      greeting: household.greeting || null,
      accommodation: household.accommodation || null,
      songs: household.songs || [],
      drinks: household.drinks || [],
      dietaryRestrictions: household.dietaryRestrictions || [],
      response: moment().format(),
    });

    return of();
  }

  updateMembers(houseHoldID: string, members: Member[]): Observable<void> {
    members.forEach(member => {
      const memberRef = this.firestore.collection(GUESTS).doc(member.id);
      memberRef.update({
        householdId: houseHoldID,
        first: member.first,
        last: member.last,
        isComing: member.isComing,
        allowedPlusOne: member.allowedPlusOne,
        hasPlusOne: member.bringingPlusOne,
        type: member.type,
      });
    });
    // TODO: return actual result of updating members
    return of();
  }

  deletePlusOne(houseHoldID: string, member: Member) {
    // get any household member that might be plus one of member passed in
    const memberPlusOne = this.firestore.collection(GUESTS).doc(member.plusOne.id);
    memberPlusOne.delete();
  }

  createOrUpdatePlusOnes(houseHoldID: string, members: PlusOne[]): Observable<void> {
    members.forEach(plusOne => {
      const data = {
        householdId: houseHoldID,
        parentId: plusOne.parentId,
        isComing: true,
        first: plusOne.first,
        last: plusOne.last,
        type: plusOne.type,
      };
      if (!!plusOne.id) { // Update
        const plusOneRef = this.firestore.collection(GUESTS).doc(plusOne.id);
        plusOneRef.update(data);
      } else { // or Create
        const plusOneCollectionRef = this.firestore.collection(GUESTS);
        plusOneCollectionRef.add(data);
      }
    });
    return of();
  }

  getNumberOfHouseholds(): Observable<number> {
    const allHouseholds = this.firestore.collection(HOUSEHOLDS);
    return from(allHouseholds.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        return results.empty ? 0 : results.size;
      })
    );
  }

  getNumberOfResponses(): Observable<number> {
    const respondedHouseholds = this.firestore.collection(HOUSEHOLDS, ref =>
      ref.where('response', '==', true));
    return from(respondedHouseholds.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        return results.empty ? 0 : results.size;
      })
    );
  }

  getAccommodationStats(): Observable<RsvpStatistics> {
    const getAccommodationStats = this.functions.httpsCallable('getAccommodationStats');
    return getAccommodationStats({});
  }

  getAdmin(email: string): Observable<Admin> {
    const adminRef = this.firestore.collection(ADMINS).doc(email);
    return from(adminRef.get()).pipe(
      map((result: firebase.firestore.DocumentSnapshot) => {
        let adminObj: Admin;
        if (result.exists) {
          adminObj = new Admin(result.id);
        } else {
          throw new Error('NotFound: Admin');
        }
        return adminObj;
      })
    );
  }

  fillHouseholdList(querySnapshot: firebase.firestore.QuerySnapshot): Household[] {
    const households = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach( result => households.push(new Household(result.id, result.data())));
    }
    return households;
  }

  fillMembersList(querySnapshot: firebase.firestore.QuerySnapshot): Member[] {
    const members = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach(result => members.push(new Member(result.id, result.data())));
    }
    return members;
  }

  sortMembersIntoHousehold(household: Household, members: Member[]): Household {
    household.members =  members.filter(member => member.householdId === household.id);
    return household;
  }

}
