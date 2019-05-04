import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {RsvpStatistics} from '../../statistics';
import {catchError, map, tap} from 'rxjs/internal/operators';
import {interval, Observable, of} from 'rxjs';
import {FirestoreService} from '../../firestore.service';

enum State {
  success,
  loading,
  error,
}


@Component({
  selector: 'app-response-statistics',
  templateUrl: './response-statistics.component.html',
  styleUrls: ['./response-statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseStatisticsComponent implements OnInit {

  loadingMessage$: Observable<string>;

  loadingMessages = [
    'determining relevant statistics',
    'evaluating your facial expression',
    'playing tic-tac-toe with dave',
    'reducing dataset for comprehension',
    'recycling previous results',
  ];

  @Input() householdId: string;

  state: State;

  statistics: Observable<RsvpStatistics>;

  colorScheme = {
    domain: ['#373e28']
  };


  constructor(private storage: FirestoreService) { }

  ngOnInit() {
    this.state = State.loading;

    this.statistics = this.storage.getAccommodationStats().pipe(
      tap(() => this.state = State.success),
      catchError(() => {
        this.state = State.error;
        return of(null);
      }),
    );
    this.loadingMessage$ = interval(1500).pipe(
      // Take modulo of i so we repeat list
      map(i => this.loadingMessages[i % this.loadingMessages.length])
    );

  }

  formatAsPercentage(value: number): string {
    return `${value}%`;
  }

  getResponsePercentage(stats: RsvpStatistics): number {
    return Math.round(stats.responses / stats.households * 100);
  }

  getFormattedAccommodations(stats: RsvpStatistics): any[] {
    return [
      {
        'name': 'Hotel',
        'value': stats.hotel / stats.responses * 100
      },
      {
        'name': 'Camping',
        'value': stats.camping / stats.responses * 100
      },
      {
        'name': 'Staying Home',
        'value': stats.home / stats.responses * 100
      },
    ];
  }

}
