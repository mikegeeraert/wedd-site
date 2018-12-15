import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Household } from '../household';
import { FirestoreService } from '../firestore.service';
import { Observable } from 'rxjs';
import {MatCheckboxChange, MatSnackBar} from '@angular/material';
import {Member, PlusOne} from '../member';

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

  household: Household;

  constructor(private fb: FormBuilder,
              private storage: FirestoreService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.storage.getHousehold('fleetwoodmac').subscribe((household: Household) => {
      this.household = household;
      this.state = State.success;
      },
      error => {
        this.state = State.error;
        this.snackBar.open(error.message, 'Error',
          {
          duration: 2000,
        });
      });
  }

  togglePlusOne($event: MatCheckboxChange, member: Member) {
    if ($event.checked) {
      member.plusOne = new PlusOne('', {parentId: member.id});
    } else {
      member.plusOne = null;
    }
  }
}
