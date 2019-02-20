import { Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { forkJoin, from, Observable, of } from 'rxjs';
import {Accommodation, Household} from './household';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import {Member, MemberType, PlusOne} from './member';
import { AccommodationStatistics, ResponseStatistics } from './statistics';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import {mapTo} from 'rxjs/internal/operators';

const HOUSEHOLDS = 'households';
const MEMBERS = 'members';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  firestore: Firestore;

  constructor() { }

  initialize (db: Firestore) {
    this.firestore = db;
  }

  // getAllMembers(): Observable<Member[]> {
  //   const households = this.firestore.collection(HOUSEHOLDS);
  //   const members = from<firebase.firestore.QuerySnapshot>(households.get()).pipe(
  //     mapTo(results => {
  //       const allMembers: Observable<Member[]>[] = [];
  //       results.forEach(result => {
  //         const householdMembersRef = households.doc(result.id).collection(MEMBERS);
  //         allMembers.push(from<firebase.firestore.QuerySnapshot>(householdMembersRef.get()).pipe(
  //           map(memberResults => {
  //             const membersObjs: Member[] = [];
  //             memberResults.forEach(memberResult => membersObjs.push(new Member(memberResult.id, memberResult.data())));
  //             return membersObjs;
  //           })
  //         ));
  //       });
  //       return allMembers;
  //     })
  //   );
  //   return forkJoin(members).pipe(
  //     map((nestedList) => {
  //       return nestedList.reduce((accumulator, list) => { accumulator.push(list); return accumulator; }, []);
  //     })
  //   );
  // }

  getHousehold(id: string): Observable<Household> {
    const householdRef = this.firestore.collection(HOUSEHOLDS).doc(id);
    const membersRef = householdRef.collection(MEMBERS).where('type', '==', MemberType.invitee.valueOf());
    const plusOnesRef = householdRef.collection(MEMBERS).where('type', '==', MemberType.plusOne.valueOf());

    const household = from(householdRef.get()).pipe(
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

    const members = from(membersRef.get()).pipe(
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

    const plusOnes = from(plusOnesRef.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        const plusOneObjs = [];
        if (!results.empty) {
          results.forEach(result => plusOneObjs.push(new PlusOne(result.id, result.data())));
        }
        return plusOneObjs;
      })
    );

    const joinedResults = forkJoin(household, members, plusOnes).pipe(
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

    return joinedResults;
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

    return from(result);
  }

  updateMembers(houseHoldID: string, members: Member[]): Observable<void> {
    members.forEach(member => {
      const memberRef = this.firestore.collection(HOUSEHOLDS).doc(houseHoldID).collection(MEMBERS).doc(member.id);
      memberRef.update({
        first: member.first,
        last: member.last,
        isComing: member.isComing,
        allowedPlusOne: member.allowedPlusOne,
        hasPlusOne: !!member.plusOne,
        type: member.type,
      });
    });
    // TODO: return actual result of updating members
    return of();
  }

  deletePlusOne(houseHoldID: string, member: Member) {
    console.log(`Deleting plus one for: ${member.first}`);
    // get any household member that might be plus one of member passed in
    const memberPlusOne = this.firestore.collection(HOUSEHOLDS).doc(houseHoldID).collection(MEMBERS).doc(member.plusOne.id);
    memberPlusOne.delete();
  }

  createOrUpdatePlusOnes(houseHoldID: string, members: PlusOne[]): Observable<void> {
    members.forEach(plusOne => {
      const data = {
        parentId: plusOne.parentId,
        first: plusOne.first,
        last: plusOne.last,
        type: plusOne.type,
      };
      if (!!plusOne.id) {
        const plusOneRef = this.firestore.collection(HOUSEHOLDS).doc(houseHoldID).collection(MEMBERS).doc(plusOne.id);
        plusOneRef.update(data);
      } else { // or Create
        const plusOneCollectionRef = this.firestore.collection(HOUSEHOLDS).doc(houseHoldID).collection(MEMBERS);
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
    const respondedHouseholds = this.firestore.collection(HOUSEHOLDS).where('response', '==', true);
    return from(respondedHouseholds.get()).pipe(
      map((results: firebase.firestore.QuerySnapshot) => {
        return results.empty ? 0 : results.size;
      })
    );
  }

  getResponseStats(): Observable<ResponseStatistics> {
    const joinedResults = forkJoin(this.getNumberOfHouseholds(), this.getNumberOfResponses()).pipe(
      map(([numHouseholds, numResponses]) => {
        // Put members on household
        console.log(numHouseholds);
        console.log(numResponses);
        return {
          numHouseholds: numHouseholds,
          numResponses: numResponses,
        };
      })
    );
    return joinedResults;
  }

  getAccomodationStats(): Observable<AccommodationStatistics> {
    const respondedHouseholds = this.firestore.collection(HOUSEHOLDS).where('response', '==', true);
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
            console.log(accommodation);
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
}
