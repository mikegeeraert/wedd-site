import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {RsvpStatistics} from '../../statistics';
import {catchError, map, tap} from 'rxjs/internal/operators';
import {Observable, of} from 'rxjs';
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
      tap(_ => this.state = State.success),
      catchError(() => {
        this.state = State.error;
        return of(null);
      }),
    );

  }

  formatAsPercentage(value: number): string {
    return `${value}%`;
  }

  getResponsePercentage(stats: RsvpStatistics): number {
    return Math.round(stats.responses/stats.households*100)
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
