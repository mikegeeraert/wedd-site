import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Member, PlusOne } from '../../member';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-step-plus-ones',
  templateUrl: './step-plus-ones.component.html',
  styleUrls: ['./step-plus-ones.component.css']
})
export class StepPlusOnesComponent {
  @Input() members: Member[];
  @Output() membersChange = new EventEmitter<Member[]>();

  constructor() { }

  togglePlusOne($event: MatCheckboxChange, member: Member) {
    if ($event.checked) {
      member.plusOne = new PlusOne('', {parentId: member.id});
    } else {
      member.plusOne = null;
    }
    this.membersChange.emit(this.members);
  }

}
