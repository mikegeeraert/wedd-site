import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MatProgressSpinnerModule, MatTableModule } from '@angular/material';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,

    MatTableModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    AdminLoginComponent,
    GuestListComponent,
  ]
})
export class AdminModule { }
