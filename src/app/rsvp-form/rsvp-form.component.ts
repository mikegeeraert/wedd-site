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
    this.household = this.storage.getHousehold('fleetwoodmac');
    this.household.subscribe((household: Household) => {
      this.state = State.success;
      console.log(household);
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

    // Build Attendance Controls
    const attendanceControls = household.members.reduce((controls, member) => {
      controls[member.id] = this.fb.control(member.isComing);
      return controls;
    }, {});

    this.attendance = this.fb.group(attendanceControls);

    // Build Plus One Controls
    const plusOneControls = household.members.reduce((controlGroups, member) => {
      if (member.allowedPlusOne) {
        const memberPlusOneControls = this.fb.group({
          isComing: this.fb.control({value: !!member.plusOne, disabled: !member.isComing}),
          plusOneFirst: this.fb.control({value: member.plusOne ? member.plusOne.first : ''}),
          plusOneLast: this.fb.control({value: member.plusOne ? member.plusOne.last : ''})
        });
        controlGroups.push(memberPlusOneControls);
      }
      return controlGroups;
    }, []);
    this.plusOnes = this.fb.group(plusOneControls);

    // Build Personal Requests controls
    const personalRequestControls = household.members.reduce((controls, member) => {
      controls[member.id] = this.fb.control(member.dietaryRestrictions);
      return controls;
    }, {
      accommodation: this.fb.control(household.accommodation),
      songs: this.fb.control(household.songs),
      drinks: this.fb.control(household.drinks)
    });
    this.personalRequests = this.fb.group(personalRequestControls);

    // Enable or Disable controls based on Attendance
    for (const controlKey in attendanceControls) {
      if (attendanceControls.hasOwnProperty(controlKey)) {
        attendanceControls[controlKey].valueChanges.subscribe((isComing: boolean) => {
          // Enable/Disable Plus One Control
          if (plusOneControls.hasOwnProperty(controlKey)) {
            // If not isComing, plus one option should be disabled
            const control = plusOneControls[controlKey];
            isComing ? control.enable() : control.disable();
          }
        });
      }
    }

    return this.fb.group([this.attendance, this.plusOnes, this.personalRequests]);
  }

  togglePlusOne(hasPlusOne: string , memberId: string) {
    // const control = this.fb.control({value: })
    // this.plusOnes.addControl(`${memberId}-plusone`, control)
  }
}
