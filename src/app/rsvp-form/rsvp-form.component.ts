import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Household } from '../household';
import { FirestoreService } from '../firestore.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

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

  rsvpForm: FormGroup;
  attendance: FormGroup;
  plusOnes: FormGroup;
  personalRequests: FormGroup;

  household: Observable<Household>;

  constructor(private fb: FormBuilder,
              private storage: FirestoreService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    // const lindseyBuckingham = {
    //   first: 'Lindsey',
    //   last: 'BuckingHam',
    //   isComing: false,
    //   allowedPlusOne: true,
    //   hasPlusOne: false,
    // };
    // const micFleetwood = {
    //   first: 'Mic',
    //   last: 'Fleetwood',
    //   isComing: false,
    //   allowedPlusOne: true,
    //   hasPlusOne: false,
    // };
    this.household = this.storage.getHousehold('fleetwoodmac');
    this.household.subscribe((household: Household) => {
      this.state = State.success;
      this.rsvpForm = this.buildRSVPForm(household);
    },
    error => {
      this.state = State.error;
      this.snackBar.open(error.message, 'Error',
        {
        duration: 2000,
      });
    });
  }

  buildRSVPForm(household: Household): FormGroup {
  const attendanceControls = household.members.reduce((controls, member) => {
    controls[member.first] = [member.isComing];
    return controls;
  }, {} );

  this.attendance = this.fb.group(attendanceControls);

  const plusOneControls = household.members.reduce((controls, member) => {
    if (member.allowedPlusOne) {
      controls[member.first] = [false];
    }
    return controls;
  }, {} );
  this.plusOnes = this.fb.group(plusOneControls);

  this.personalRequests = this.fb.group({
    accommodation: [household.accommodation],
    songs: [household.songs],
    drinks: [household.drinks],
    dietaryRestrictions: [household.dietaryRestrictions],
  });

  return this.fb.group([this.attendance, this.plusOnes, this.personalRequests]);
}
}
