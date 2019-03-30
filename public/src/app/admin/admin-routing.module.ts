import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLoginComponent} from './admin-login/admin-login.component';
import {GuestListComponent} from './guest-list/guest-list.component';

const routes: Routes = [
  {path: 'admin-login', component: AdminLoginComponent},
  {path: 'guest-list', component: GuestListComponent},
  {path: '**', redirectTo: 'admin-login'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule {}
