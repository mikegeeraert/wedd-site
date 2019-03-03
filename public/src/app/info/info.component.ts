import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  panelOpenState = false;
  title: string = 'River Cove Campground';
  lat: number = 50.896209;
  lng: number = -114.696851;

  constructor() { }

  ngOnInit() {
  }

}
