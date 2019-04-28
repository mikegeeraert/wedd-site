import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getDirections(placeID: string) {
    window.href = `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeID}`
  }
}
