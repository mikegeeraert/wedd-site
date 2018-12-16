import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Household } from '../household';
import { FirestoreService } from '../firestore.service';
import {Observable, of} from 'rxjs';
import {MatCheckboxChange, MatSnackBar} from '@angular/material';
import {Member, PlusOne} from '../member';
import {catchError, tap} from 'rxjs/internal/operators';

enum State {
  success,
  loading,
  error,
}

@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.css']
})
export class RsvpFormComponent implements OnInit {
  state: State = State.loading;

  household: Observable<Household>;

  constructor(private fb: FormBuilder,
              private storage: FirestoreService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.household = this.storage.getHousehold('fleetwoodmac').pipe(
      tap( household => {
          console.log(household);
          this.state = State.success;
      }),
      catchError((error, _) => {
        this.state = State.error;
        this.snackBar.open(error.message, 'Error',
          {
            duration: 2000,
          });
        return of(new Household('', {}));
      }),
    );
    // .subscribe((household: Household) => {
    //       this.household = household;
    //       console.log(this.household);
    //       this.state = State.success;
    //     },
    //     error => {
    //       this.state = State.error;
    //       this.snackBar.open(error.message, 'Error',
    //         {
    //           duration: 2000,
    //         });
    //     });
  }

  togglePlusOne($event: MatCheckboxChange, member: Member) {
    if ($event.checked) {
      member.plusOne = new PlusOne('', {parentId: member.id});
    } else {
      member.plusOne = null;
    }
  }

  saveForm(household: Household) {
    this.storage.updateHouseHold(household).subscribe(
      () => {
        this.snackBar.open('You are the greatest', 'Success',
          {
            duration: 2000,
          });
      },
      error => {
        this.snackBar.open(`There was an issue. Try again a bunch or just text one of us.`, 'Error',
          {
            duration: 3000,
          });
      }
    );
    this.storage.updateMembers(household.id, household.members);

    // Filter members for plus ones and flatten list
    const plusOnes = household.members.filter(member => !!member.plusOne).map(member => member.plusOne);
    this.storage.createOrUpdatePlusOnes(household.id, plusOnes);
  }
}
