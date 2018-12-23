import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-option-list',
  templateUrl: './option-list.component.html',
  styleUrls: ['./option-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => OptionListComponent),
    }
  ]
})
export class OptionListComponent implements ControlValueAccessor {
  @Input() checkboxOptions: {text: string, value: string}[];

  _values = [];
  _onChange: (_: any) => void;
  _onTouched: (_: any) => void;

  constructor() { }

  writeValue(values: string[]): void {
    this._values = values;
  }

  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: (_: any) => void): void {
    this._onTouched = fn;
  }

  selectionChanged(event: MatCheckboxChange): void {
    const value = event.source.id;
    if (event.checked) {
      this.add(value);
    } else {
      this.remove(value);
    }
    this._onChange(event);
  }

  add(value: string): void {
    if (!this._values.includes(value)) {
      this._values.push(value);
    }
  }

  remove(value: string): void {
    const index = this._values.indexOf(value);

    if (index >= 0) {
      this._values.splice(index, 1);
    }
  }

}
