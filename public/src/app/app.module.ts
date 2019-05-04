import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

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
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { AgmCoreModule } from '@agm/core';

import { RsvpFormComponent } from './rsvp-form/rsvp-form.component';
import { OurStoryComponent } from './our-story/our-story.component';
import {  RouterModule, Routes} from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChipListComponent } from './rsvp-form/chip-list/chip-list.component';
import { StepAttendanceComponent } from './rsvp-form/step-attendance/step-attendance.component';
import { StepPlusOnesComponent } from './rsvp-form/step-plus-ones/step-plus-ones.component';
import { StepPreferencesComponent } from './rsvp-form/step-preferences/step-preferences.component';
import { OptionListComponent } from './rsvp-form/option-list/option-list.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResponseStatisticsComponent } from './info/response-statistics/response-statistics.component';
import { InfoComponent } from './info/info.component';
import { CanViewRSVP } from './guards';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { environment } from '../environments/environment';
import { MountainscapePageComponent } from './mountainscape-page/mountainscape-page.component';
import { SongListComponent } from './info/response-statistics/song-list/song-list.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: 'our-story', component: OurStoryComponent},
  {path: 'info', component: InfoComponent},
  {path: 'rsvp/:userId', component: RsvpFormComponent, canActivate: [CanViewRSVP]},
  {path: 'authenticate', component: AuthenticateComponent},
  {path: 'about', component: AboutComponent},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
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
    ResponseStatisticsComponent,
    InfoComponent,
    AuthenticateComponent,
    MountainscapePageComponent,
    SongListComponent,
    AboutComponent,
  ],
  imports: [

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,

    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    RouterModule.forRoot(
      routes,
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
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDl6sYXZLEyYzEt9EDz6naQj9S-FtBt-kk'
    }),

  ],
  providers: [
    FormBuilder,
    CanViewRSVP,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
