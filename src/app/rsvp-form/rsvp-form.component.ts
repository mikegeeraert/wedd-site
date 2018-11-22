import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

interface Household {
  members: Member[];
  isCamping: boolean;
  isHoteling: boolean;
  otherLodging: boolean;
  songs: string[];
  drinks: string[];
  dietaryRestrictions: string[];
}

interface Member {
  first: string;
  last: string;
  isComing: boolean;
  allowedPlusOne: boolean;
  hasPlusOne: boolean;
}


@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.css']
})
export class RsvpFormComponent implements OnInit {

  attendance: FormGroup;
  plusOnes: FormGroup;
  personalRequests: FormGroup;

  household: Household;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    const stevieNicks = {
      first: 'Stevie',
      last: 'Nicks',
      isComing: false,
      allowedPlusOne: false,
      hasPlusOne: false,
    };
    const lindseyBuckingham = {
      first: 'Lindsey',
      last: 'BuckingHam',
      isComing: false,
      allowedPlusOne: true,
      hasPlusOne: false,
    };
    const micFleetwood = {
      first: 'Mic',
      last: 'Fleetwood',
      isComing: false,
      allowedPlusOne: true,
      hasPlusOne: false,
    };

    this.household = {
      members: [lindseyBuckingham, micFleetwood, stevieNicks],
      isCamping: false,
      isHoteling: false,
      otherLodging: false,
      songs: [],
      drinks: [],
      dietaryRestrictions: [],
    };

    const attendanceControls = this.household.members.reduce((controls, member) => {
      controls[member.first] = [member.isComing];
      return controls;
    }, {} );

    this.attendance = this.fb.group(attendanceControls);

    const plusOneControls = this.household.members.reduce((controls, member) => {
      if (member.allowedPlusOne) {
        controls[member.first] = [false];
      }
      return controls;
    }, {} );
    this.plusOnes = this.fb.group(plusOneControls);

    this.personalRequests = this.fb.group({
      isCamping: [this.household.isCamping],
      isHoteling: [this.household.isHoteling],
      otherLodging: [this.household.otherLodging],
      songs: [this.household.songs],
      drinks: [this.household.drinks],
      dietaryRestrictions: [this.household.dietaryRestrictions],
    });
  }

  householdHasPlusOnes(): boolean {
    return this.household.members.some(member => member.allowedPlusOne);
  }
}
