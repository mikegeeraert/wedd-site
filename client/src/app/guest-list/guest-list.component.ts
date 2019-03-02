import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';


interface Guest {
  firstName: string;
  lastName: string;
  bringingPlusOne: boolean;
}


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css']
})
export class GuestListComponent implements OnInit {

  dataSource: Guest[];

  constructor(private storage: FirestoreService) { }

  ngOnInit() {
  }

}
