import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatRadioModule, MatSnackBarModule,
  MatStepperModule,
  MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';


import { RsvpFormComponent } from './rsvp-form/rsvp-form.component';
import { OurStoryComponent } from './our-story/our-story.component';
import { RouterModule, Routes} from '@angular/router';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ChipListComponent } from './rsvp-form/chip-list/chip-list.component';
import { StepAttendanceComponent } from './rsvp-form/step-attendance/step-attendance.component';
import { StepPlusOnesComponent } from './rsvp-form/step-plus-ones/step-plus-ones.component';
import { StepPreferencesComponent } from './rsvp-form/step-preferences/step-preferences.component';
import { OptionListComponent } from './rsvp-form/option-list/option-list.component';
import { ResponseMeterComponent } from './our-story/response-meter/response-meter.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DrinkRequestChartComponent } from './our-story/drink-request-chart/drink-request-chart.component';


const routes: Routes = [
  {path: '', component: OurStoryComponent},
  {path: 'rsvp/:userId', component: RsvpFormComponent},
  {path: '**', redirectTo: ''},
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
    DrinkRequestChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    RouterModule.forRoot(
      routes,
      // { enableTracing: true } // <-- debugging purposes only
    ),

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
    MatSnackBarModule,
  ],
  providers: [
    FormBuilder
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
