import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Household } from '../household';
import { FirestoreService } from '../firestore.service';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { catchError, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    const userId = this.route.snapshot.params['userId'];
    if (!userId) {
      this.state = State.error;
      this.snackBar.open('Ooops! No guest specified!', 'Error',
        {
          duration: 2000,
        });
    }
    this.household = this.storage.getHousehold(userId).pipe(
      tap( household => {
          this.state = State.success;
      }),
      catchError((error, _) => {
        this.state = State.error;
        this.snackBar.open(error.message, 'Error',
          {
            duration: 2000,
          });
        return of(null);
      }),
    );
  }

  onSubmit(household: Household) {
    // TODO: Refactor this method - listen to the results of updating members and plus ones - forkjoin results
    this.storage.updateHouseHold(household).subscribe(
      () => {
        this.snackBar.open('You are the greatest', 'Success',
          {
            duration: 5000,
          });
        this.router.navigateByUrl('/');
      },
      (/*error*/) => {
        this.snackBar.open(`There was an issue. Try again or just message Michael or Taylor.`, 'Error',
          {
            duration: 3000,
          });
      }
    );
    this.storage.updateMembers(household.id, household.members);

    // Filter members not bringing a plus one, but we previously saved one for them
    const members =  household.members.filter(member => !member.bringingPlusOne && member.plusOne && member.plusOne.id);
    members.forEach(member => this.storage.deletePlusOne(household.id, member));

    // Filter members bringing plus ones and flatten list
    const plusOnes = household.members.filter(member => member.bringingPlusOne && !!member.plusOne).map(member => member.plusOne);
    this.storage.createOrUpdatePlusOnes(household.id, plusOnes);
    this.router.navigate(['info']);
  }
}
