import { Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import {forkJoin, from, Observable, of} from 'rxjs';
import { Household } from './household';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import {Member, MemberType, PlusOne} from './member';

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
      greeting: household.greeting,
      accommodation: household.accommodation,
      songs: household.songs,
      drinks: household.drinks,
      dietaryRestrictions: household.dietaryRestrictions,
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

  createOrUpdatePlusOnes(houseHoldID: string, plusOnes: PlusOne[]) {
    plusOnes.forEach(plusOne => {
      const data = {
        parentId: plusOne.parentId,
        first: plusOne.first,
        last: plusOne.last,
        type: plusOne.type,
      };
      // Update
      if (!!plusOne.id) {
        const plusOneRef = this.firestore.collection(HOUSEHOLDS).doc(houseHoldID).collection(MEMBERS).doc(plusOne);
        plusOneRef.update(data);
      } else { // or Create
        const plusOneCollectionRef = this.firestore.collection(HOUSEHOLDS).doc(houseHoldID).collection(MEMBERS);
        plusOneCollectionRef.add(data);
      }
    });
    // TODO: return actual result of updating plusOnes
    return of();
  }
}
