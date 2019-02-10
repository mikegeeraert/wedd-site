import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {catchError, map, tap} from 'rxjs/internal/operators';
import { FirestoreService } from '../../firestore.service';
import { AccommodationStatistics } from '../../statistics';
import { Accommodation } from '../../household';


enum State {
  success,
  loading,
  error,
}

@Component({
  selector: 'app-drink-request-chart',
  templateUrl: './drink-request-chart.component.html',
  styleUrls: ['./drink-request-chart.component.css']
})
export class DrinkRequestChartComponent implements OnInit {

  state: State;
  statistics: Observable<any[]>;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };
  constructor(private storage: FirestoreService) { }

  ngOnInit() {
    this.state = State.loading;

    this.statistics = this.storage.getAccomodationStats().pipe(
      tap(_ => this.state = State.success),
      catchError(error => {
        this.state = State.error;
        return of({total: 0, distribution: new Map<Accommodation, number>()});
      }),
      map((stats: AccommodationStatistics) => {
        console.log(stats);
        return [
          {
            'name': 'Hotel',
            'value': stats.distribution.get(Accommodation.hotel) / stats.total * 100
          },
          {
            'name': 'Camping',
            'value': stats.distribution.get(Accommodation.camping) / stats.total * 100
          },
          {
            'name': 'Staying Home',
            'value': stats.distribution.get(Accommodation.home) / stats.total * 100
          },
        ];
      })
    );
  }

}
