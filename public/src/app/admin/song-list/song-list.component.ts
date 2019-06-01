import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {FirestoreService} from '../../firestore.service';
import {map, tap} from 'rxjs/operators';
import {Household} from '../../household';
import {Member} from '../../member';

interface SongSuggestion {
  householdName: string;
  householdFirstNames: string;
  song: string;
}

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css']
})
export class SongListComponent implements OnInit {

  dataSource: Observable<SongSuggestion[]>;
  totalComing: Observable<number>;
  totalMissing: Observable<number>;
  displayedColumns: string[] = ['household', 'firstNames', 'song'];

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.dataSource = this.firestoreService.listHouseholds().pipe(
      map(households => households.reduce(
        (suggestions, household) => {
          suggestions.push(...this.songsToSongSuggestions(household, household.songs));
          return suggestions;
        }, [])
      )
    );
  }

  songsToSongSuggestions(household: Household, songs: string[]): SongSuggestion[] {
    return songs.map(song => ({
      householdName: household.name,
      householdFirstNames: this.formatFirstNames(household.members),
      song: song
    }));
  }

  formatFirstNames(members: Member[]): string {
    return members.map(member => member.first).join(', ');
  }

}
