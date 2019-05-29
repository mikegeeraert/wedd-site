import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  links = [
    {label: 'Households', path: 'households'},
    {label: 'Guests', path: 'guest-list'}
  ];
  activeLink = this.links[0];

  constructor() { }

  ngOnInit() {
  }

}
