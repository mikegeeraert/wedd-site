import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';
import {startWith, delay} from 'rxjs/operators';
import {fearFactor, halloween, horrorMovie, rockPaperScissors, traits, zombie} from './about-stats';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  colorScheme = {
    domain: ['#676767', '#252525']
  };

  traits$: Observable<any[]>;
  horror$: Observable<any[]>;
  zombie$: Observable<any[]>;
  rockPaperScissors$: Observable<any[]>;
  halloween$: Observable<any[]>;
  fearFactor$: Observable<any[]>;

  constructor() { }

  ngOnInit() {
    this.traits$ = of(traits).pipe(startWith([]), delay(1000));
    this.horror$ = of(horrorMovie).pipe(startWith([]), delay(1500));
    this.zombie$ = of(zombie).pipe(startWith([]), delay(2000));
    this.rockPaperScissors$ = of(rockPaperScissors).pipe(startWith([]), delay(2500));
    this.halloween$ = of(halloween).pipe(startWith([]), delay(3000));
    this.fearFactor$ = of(fearFactor).pipe(startWith([]), delay(3500));
  }

}
