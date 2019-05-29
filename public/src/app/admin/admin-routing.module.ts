import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { IsAdmin } from './guards';
import {HomeComponent} from './home/home.component';
import {HouseholdListComponent} from './household-list/household-list.component';

const routes: Routes = [
  {path: 'login', component: AdminLoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [IsAdmin], children: [
      {path: 'households', component: HouseholdListComponent},
      {path: 'guest-list', component: GuestListComponent},
    ]},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule {}

