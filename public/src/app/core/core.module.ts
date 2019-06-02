import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipListComponent } from './chip-list/chip-list.component';
import {MatChipsModule, MatIconModule, MatInputModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatInputModule,
    MatIconModule,
  ],
  declarations: [
    ChipListComponent,
  ],
  exports: [
    ChipListComponent,
  ]
})
export class CoreModule { }
