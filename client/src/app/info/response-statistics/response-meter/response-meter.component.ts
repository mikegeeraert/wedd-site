import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import { FirestoreService } from '../../../firestore.service';
import { ResponseStatistics } from '../../../statistics';
import {catchError, tap} from 'rxjs/internal/operators';
import {Household} from '../../../household';

enum State {
  success,
  loading,
  error,
}

@Component({
  selector: 'app-response-meter',
  templateUrl: './response-meter.component.html',
  styleUrls: ['./response-meter.component.css']
})
export class ResponseMeterComponent implements OnInit {

  round = Math.round;
  state: State;

  statistics: Observable<ResponseStatistics>;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  constructor(private storage: FirestoreService) { }

  ngOnInit() {
    this.state = State.loading;

    this.statistics = this.storage.getResponseStats().pipe(
      tap(_ => this.state = State.success),
      catchError(error => {
        this.state = State.error;
        return of(null);
      })
    );
  }

  formatAsPercentage(value: number): string {
    return `${value}%`;
  }

}
