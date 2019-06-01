import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { AdminRoutingModule } from './admin-routing.module';
import {
  MatButtonModule,
  MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatSnackBarModule,
  MatTableModule, MatTabsModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IsAdmin} from './guards';
import { HouseholdListComponent } from './household-list/household-list.component';
import { HomeComponent } from './home/home.component';
import { SongListComponent } from './song-list/song-list.component';

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

    ReactiveFormsModule,
    FormsModule,
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
