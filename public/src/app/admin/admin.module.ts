import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { AdminRoutingModule } from './admin-routing.module';
import {
  MatButtonModule,
  MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTableModule, MatTabsModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IsAdmin} from './guards';
import { HouseholdListComponent } from './household-list/household-list.component';
import { HomeComponent } from './home/home.component';
import { SongListComponent } from './song-list/song-list.component';
import {ChipListComponent} from '../core/chip-list/chip-list.component';
import {AppModule} from '../app.module';
import {CoreModule} from '../core/core.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,

    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatListModule,
    MatMenuModule,

    ReactiveFormsModule,
    FormsModule,

    CoreModule,
  ],
  declarations: [
    AdminLoginComponent,
    GuestListComponent,
    HouseholdListComponent,
    HomeComponent,
    SongListComponent,
  ],
  providers: [
    IsAdmin
  ]
})
export class AdminModule { }
