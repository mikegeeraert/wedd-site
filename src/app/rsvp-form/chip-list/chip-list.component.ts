import {Component, forwardRef, Input, OnInit} from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ChipListComponent),
    }
  ]
})
export class ChipListComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  _values = [];
  _onChange: (_: any) => void;
  _onTouched: (_: any) => void;

  constructor() { }

  ngOnInit() {
  }

  writeValue(values: string[]): void {
    this._values = values;
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: (_: any) => void): void {
    this._onTouched = fn;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this._values.push(value);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(fruit: string): void {
    const index = this._values.indexOf(fruit);

    if (index >= 0) {
      this._values.splice(index, 1);
    }
  }
}
