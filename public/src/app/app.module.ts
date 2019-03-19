import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatRadioModule, MatSnackBarModule,
  MatStepperModule, MatTableModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AgmCoreModule } from '@agm/core';


import { RsvpFormComponent } from './rsvp-form/rsvp-form.component';
import { OurStoryComponent } from './our-story/our-story.component';
import {ActivatedRouteSnapshot, RouterModule, Routes} from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChipListComponent } from './rsvp-form/chip-list/chip-list.component';
import { StepAttendanceComponent } from './rsvp-form/step-attendance/step-attendance.component';
import { StepPlusOnesComponent } from './rsvp-form/step-plus-ones/step-plus-ones.component';
import { StepPreferencesComponent } from './rsvp-form/step-preferences/step-preferences.component';
import { OptionListComponent } from './rsvp-form/option-list/option-list.component';
import { ResponseMeterComponent } from './info/response-statistics/response-meter/response-meter.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AccommodationsChartComponent } from './info/response-statistics/accommodations-chart/accommodations-chart.component';
import { ResponseStatisticsComponent } from './info/response-statistics/response-statistics.component';
import { InfoComponent } from './info/info.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { CanViewRSVP } from './guards';
import { AuthenticateComponent } from './authenticate/authenticate.component';


const routes: Routes = [
  {path: 'our-story', component: OurStoryComponent},
  {path: 'info', component: InfoComponent},
  {path: 'rsvp/:userId', component: RsvpFormComponent, canActivate: [CanViewRSVP]},
  {path: 'authenticate', component: AuthenticateComponent},
  {path: '**', redirectTo: 'our-story'},
];

@NgModule({
  declarations: [
    AppComponent,
    RsvpFormComponent,
    OurStoryComponent,
    ChipListComponent,
    StepAttendanceComponent,
    StepPlusOnesComponent,
    StepPreferencesComponent,
    OptionListComponent,
    ResponseMeterComponent,
    AccommodationsChartComponent,
    ResponseStatisticsComponent,
    InfoComponent,
    GuestListComponent,
    AuthenticateComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    MatTableModule,

    // For Charting
    NgxChartsModule,

    // For Navigation
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,


    // For RSVP Form
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,

    // For Info Page
    MatExpansionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDl6sYXZLEyYzEt9EDz6naQj9S-FtBt-kk'
    })

  ],
  providers: [
    FormBuilder,
    CanViewRSVP,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
