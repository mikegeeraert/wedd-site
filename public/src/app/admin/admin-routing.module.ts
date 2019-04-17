import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { IsAdmin } from './guards';

const routes: Routes = [
  {path: 'login', component: AdminLoginComponent},
  {path: 'guest-list', component: GuestListComponent, canActivate: [IsAdmin]},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule {}

