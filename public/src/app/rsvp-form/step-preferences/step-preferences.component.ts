import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step-preferences',
  templateUrl: './step-preferences.component.html',
  styleUrls: ['./step-preferences.component.css']
})
export class StepPreferencesComponent {
  @Input() accommodation: string[];
  @Output() accommodationChange = new EventEmitter<string>();
  @Input() songs: string[];
  @Output() songsChange = new EventEmitter<string[]>();
  @Input() drinks: string[];
  @Output() drinksChange = new EventEmitter<string[]>();
  @Input() dietaryRestrictions: string;
  @Output() dietaryRestrictionsChange = new EventEmitter<string>();

  drinkOptions: {text: string, value: string}[] = [
    {text: 'Tequila', value: 'tequila'},
    {text: 'Whiskey', value: 'whiskey'},
    {text: 'Wine', value: 'wine'},
    {text: 'Beer', value: 'beer'},
  ];

}
