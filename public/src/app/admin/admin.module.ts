import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule
  ],
  declarations: [
    AdminLoginComponent,
    GuestListComponent,
  ]
})
export class AdminModule { }
