import { Injectable } from '@angular/core';
import {combineLatest, forkJoin, from, merge, Observable, of} from 'rxjs';
import { Accommodation, Household } from './household';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Member, MemberType, PlusOne } from './member';
import { AccommodationStatistics, ResponseStatistics } from './statistics';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import {Admin} from './admin';
import DocumentData = firebase.firestore.DocumentData;

const HOUSEHOLDS = 'households';
const GUESTS = 'guests';
const ADMINS = 'admins';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  // firestore: Firestore;

  constructor(private firestore: AngularFirestore) { }

  // initialize (db: Firestore) {
  //   this.firestore = db;
  // }

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
    )
  }

  listMembers(searchTerm: string): Observable<Member[]> {
    // Build Members query
    let membersRef: Observable<firebase.firestore.QuerySnapshot>;

    // if no search term, return all guests
    if (searchTerm == '') {
      membersRef = this.firestore.collection(GUESTS,
        ref => ref.where('type', '==', MemberType.invitee.valueOf())
      ).get();
    }
    // if search term, return guests with full match on first or last name
    else {
      const firstMatch = this.firestore.collection(GUESTS, ref => ref.
      where('type', '==', MemberType.invitee.valueOf()).
      where('first', '==', searchTerm));
      const lastMatch = this.firestore.collection(GUESTS, ref => ref.
      where('type', '==', MemberType.invitee.valueOf()).
      where('last', '==', searchTerm));
      membersRef = merge(firstMatch.get(), lastMatch.get());
    }


    // Get results, build/sort Member list
    return membersRef.pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        const membersObjs = [];
        if (!results.empty) {
          results.forEach(result => membersObjs.push(new Member(result.id, result.data())));
        }
        return membersObjs;
      }),
      //Sort alphabetically by last name
      map((membersObjs: Member[]) => membersObjs.sort((a, b) => a.last.localeCompare(b.last)))
    );
  }

  getHousehold(id: string): Observable<Household> {
    const householdRef = this.firestore.collection(HOUSEHOLDS).doc(id);
    const attendeesRef = this.firestore.collection(GUESTS, ref => ref.where('householdId', '==', id));
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
      accommodation: household.accommodation,
      songs: household.songs || [],
      drinks: household.drinks || [],
      dietaryRestrictions: household.dietaryRestrictions || [],
      response: true,
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

  getResponseStats(): Observable<ResponseStatistics> {
    return forkJoin(this.getNumberOfHouseholds(), this.getNumberOfResponses()).pipe(
      map(([numHouseholds, numResponses]) => {
        return {
          numHouseholds: numHouseholds,
          numResponses: numResponses,
        };
      })
    );
  }

  getAccomodationStats(): Observable<AccommodationStatistics> {
    const respondedHouseholds = this.firestore.collection(HOUSEHOLDS, ref =>
      ref.where('response', '==', true));
    return from(respondedHouseholds.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        const stats = {
          total: 0,
          distribution: new Map<Accommodation, number>([
            [Accommodation.camping, 0],
            [Accommodation.home, 0],
            [Accommodation.hotel, 0]
          ]),
        };
        if (!results.empty) {
          results.forEach((result: QueryDocumentSnapshot) => {
            const accommodation = result.data().accommodation;
            stats.total += 1;
            switch (accommodation) {
              case Accommodation.camping:
                const campingVal = stats.distribution.get(Accommodation.camping) + 1;
                stats.distribution.set(Accommodation.camping, campingVal);
                break;
              case Accommodation.home:
                const homeVal = stats.distribution.get(Accommodation.home) + 1;
                stats.distribution.set(Accommodation.home, homeVal);
                break;
              case Accommodation.hotel:
                const hotelVal = stats.distribution.get(Accommodation.hotel) + 1;
                stats.distribution.set(Accommodation.camping, hotelVal);
                break;
            }
          });
        }
        return stats;
      })
    );
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
    )
  }
}
