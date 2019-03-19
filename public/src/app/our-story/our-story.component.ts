import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.css'],
  host: {
    '(window:scroll)': 'taylorsFunction()'
  }
})
export class OurStoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  taylorsFunction(): void {
    const scrollTop = window.scrollY;

  }

}
