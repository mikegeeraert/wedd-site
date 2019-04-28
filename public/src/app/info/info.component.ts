import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }

  getDirections(name: string, placeID: string) {
    const args = `?destination=${name}&destination_place_id=${placeID}`;
    const url = `https://www.google.com/maps/dir/?api=1${args}`;
    console.log(url);
    this.document.location.href = url;
  }
}
