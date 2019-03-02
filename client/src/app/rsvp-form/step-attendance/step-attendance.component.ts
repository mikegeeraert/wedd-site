import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Member, PlusOne} from '../../member';
import {MatCheckboxChange} from '@angular/material';

@Component({
  selector: 'app-step-attendance',
  templateUrl: './step-attendance.component.html',
  styleUrls: ['./step-attendance.component.css']
})
export class StepAttendanceComponent implements OnInit {
  @Input() members: Member[];
  @Output() membersChange = new EventEmitter<Member[]>();

  constructor() { }

  ngOnInit() {
    console.log(this.members);
  }

  toggleAttendance($event: MatCheckboxChange, member: Member) {
    if (!$event.checked) {
      member.bringingPlusOne = false; // If not coming, remove plusOne
    }
    this.membersChange.emit(this.members);
  }

}