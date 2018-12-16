import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Member } from '../../member';

@Component({
  selector: 'app-step-attendance',
  templateUrl: './step-attendance.component.html',
  styleUrls: ['./step-attendance.component.css']
})
export class StepAttendanceComponent {
  @Input() members: Member[];
  @Output() membersChange = new EventEmitter<Member[]>();

  constructor() { }

}
