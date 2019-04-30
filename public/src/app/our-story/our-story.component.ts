import {
  ChangeDetectionStrategy,
  Component, OnInit,
} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthenticationService} from '../authentication.service';
import {FirestoreService} from '../firestore.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OurStoryComponent implements OnInit {

  householdId: Observable<string>;

  constructor(private userService: AuthenticationService,
              private storageService: FirestoreService) {}

  ngOnInit(){
    this.householdId = this.userService.user.pipe(
      switchMap(user => {
        if (user) {
          return this.storageService.getHouseholdIdForEmail(user.uid)
        }
        return of(null);
      })
    )
  }

}
