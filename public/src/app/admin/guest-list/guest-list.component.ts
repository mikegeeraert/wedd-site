import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Member } from '../../member';
import {BehaviorSubject, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AngularFireFunctions} from '@angular/fire/functions';


@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuestListComponent implements OnInit {

  dataSource: Observable<Member[]>;
  displayedColumns: string[] = ['first', 'last', 'email', 'isComing', 'rsvp-link', 'invite'];

  searchTerm$$ = new BehaviorSubject('');
  searchTerm: string;


  constructor(private firestoreService: FirestoreService, private functions: AngularFireFunctions) { }

  ngOnInit() {
    this.dataSource = this.searchTerm$$.pipe(
      switchMap(searchTerm => this.firestoreService.listMembers(searchTerm)),
    );
  }

  search() {
    this.searchTerm$$.next(this.searchTerm);
  }

  formatRsvpLink(member: Member): string {
    return member.email ? `https://geeraertwedding.ca/authenticate?email=${member.email}&householdId=${member.householdId}` : '';
  }

  downloadHtml(member: Member): void {
    const authFunction = this.functions.httpsCallable('generateInviteBody');
    authFunction({emailAddress: member.email, householdId: member.householdId}).
    subscribe(inviteBody => this.download(`${member.first}-${member.last}.html`, inviteBody));
  }

  download(filename: string, content: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

}
